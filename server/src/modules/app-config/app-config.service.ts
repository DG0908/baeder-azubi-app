import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { AppRole, Prisma } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  APP_CONFIG_DEFAULT_THEME_COLORS,
  APP_CONFIG_GROUP_IDS,
  APP_CONFIG_MENU_IDS,
  APP_CONFIG_PERMISSION_KEYS,
  APP_CONFIG_THEME_KEYS
} from './app-config.constants';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';

type AppConfigRecord = {
  id: string;
  organizationId: string;
  menuItems: Prisma.JsonValue;
  themeColors: Prisma.JsonValue;
  updatedById: string | null;
  updatedAt: Date;
};

type MenuItemPayload = {
  id: string;
  icon: string;
  label: string;
  visible: boolean;
  order: number;
  requiresPermission: string | null;
  group: string;
};

@Injectable()
export class AppConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService
  ) {}

  async getConfig(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      return this.buildDefaultPayload(null);
    }

    const config = await this.prisma.appConfig.findUnique({
      where: {
        organizationId: actor.organizationId
      },
      select: {
        id: true,
        organizationId: true,
        menuItems: true,
        themeColors: true,
        updatedById: true,
        updatedAt: true
      }
    });

    if (!config) {
      return this.buildDefaultPayload(actor.organizationId);
    }

    return this.toPayload(config);
  }

  async updateConfig(actor: AuthenticatedUser, dto: UpdateAppConfigDto, request: Request) {
    this.assertAdmin(actor);

    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    const menuItems = this.normalizeMenuItems(dto.menuItems);
    const themeColors = this.normalizeThemeColors(dto.themeColors);

    const updated = await this.prisma.appConfig.upsert({
      where: {
        organizationId: actor.organizationId
      },
      create: {
        organizationId: actor.organizationId,
        menuItems,
        themeColors,
        updatedById: actor.id
      },
      update: {
        menuItems,
        themeColors,
        updatedById: actor.id
      },
      select: {
        id: true,
        organizationId: true,
        menuItems: true,
        themeColors: true,
        updatedById: true,
        updatedAt: true
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'app_config.updated',
      'AppConfig',
      updated.id,
      {
        organizationId: actor.organizationId,
        menuItemCount: menuItems.length,
        themeKeys: Object.keys(themeColors)
      },
      request
    );

    return this.toPayload(updated);
  }

  private buildDefaultPayload(organizationId: string | null) {
    return {
      organizationId,
      menuItems: [],
      themeColors: { ...APP_CONFIG_DEFAULT_THEME_COLORS },
      updatedById: null,
      updatedAt: null
    };
  }

  private toPayload(config: AppConfigRecord) {
    return {
      organizationId: config.organizationId,
      menuItems: this.normalizeMenuItemsFromStorage(config.menuItems),
      themeColors: this.normalizeThemeColorsFromStorage(config.themeColors),
      updatedById: config.updatedById,
      updatedAt: config.updatedAt.toISOString()
    };
  }

  private normalizeMenuItems(value: unknown[]): MenuItemPayload[] {
    if (!Array.isArray(value)) {
      throw new BadRequestException('menuItems must be an array.');
    }

    const allowedIds = new Set(APP_CONFIG_MENU_IDS);
    const allowedGroups = new Set(APP_CONFIG_GROUP_IDS);
    const allowedPermissions = new Set(APP_CONFIG_PERMISSION_KEYS);
    const normalizedItems: MenuItemPayload[] = [];
    const seenIds = new Set<string>();

    value.forEach((entry, index) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        throw new BadRequestException(`menuItems[${index}] is invalid.`);
      }

      const candidate = entry as Record<string, unknown>;
      const id = String(candidate.id || '').trim();
      if (!allowedIds.has(id as (typeof APP_CONFIG_MENU_IDS)[number])) {
        throw new BadRequestException(`menuItems[${index}].id is invalid.`);
      }

      if (seenIds.has(id)) {
        throw new BadRequestException(`menuItems contains duplicate id "${id}".`);
      }
      seenIds.add(id);

      const requiresPermissionValue = candidate.requiresPermission;
      const requiresPermission = requiresPermissionValue === null || requiresPermissionValue === undefined || String(requiresPermissionValue).trim() === ''
        ? null
        : String(requiresPermissionValue).trim();

      if (requiresPermission && !allowedPermissions.has(requiresPermission as (typeof APP_CONFIG_PERMISSION_KEYS)[number])) {
        throw new BadRequestException(`menuItems[${index}].requiresPermission is invalid.`);
      }

      const group = String(candidate.group || '').trim();
      if (!allowedGroups.has(group as (typeof APP_CONFIG_GROUP_IDS)[number])) {
        throw new BadRequestException(`menuItems[${index}].group is invalid.`);
      }

      const order = Number(candidate.order);
      if (!Number.isFinite(order) || order < 0 || order > 100) {
        throw new BadRequestException(`menuItems[${index}].order is invalid.`);
      }

      normalizedItems.push({
        id,
        icon: this.sanitizeUiString(candidate.icon, 'icon', 16),
        label: this.sanitizeUiString(candidate.label, 'label', 80),
        visible: Boolean(candidate.visible),
        order: Math.round(order * 100) / 100,
        requiresPermission,
        group
      });
    });

    if (seenIds.size !== APP_CONFIG_MENU_IDS.length) {
      throw new BadRequestException('menuItems must contain every known menu item exactly once.');
    }

    return normalizedItems.sort((left, right) => left.order - right.order);
  }

  private normalizeMenuItemsFromStorage(value: Prisma.JsonValue) {
    if (!Array.isArray(value)) {
      return [];
    }

    const items = value
      .map((entry) => {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
          return null;
        }

        const source = entry as Record<string, unknown>;
        return {
          id: String(source.id || ''),
          icon: String(source.icon || ''),
          label: String(source.label || ''),
          visible: Boolean(source.visible),
          order: Number(source.order || 0),
          requiresPermission: source.requiresPermission ? String(source.requiresPermission) : null,
          group: String(source.group || '')
        };
      })
      .filter(Boolean) as Array<{
        id: string;
        icon: string;
        label: string;
        visible: boolean;
        order: number;
        requiresPermission: string | null;
        group: string;
      }>;

    return items
      .filter((entry) => APP_CONFIG_MENU_IDS.includes(entry.id as (typeof APP_CONFIG_MENU_IDS)[number]))
      .sort((left, right) => left.order - right.order);
  }

  private normalizeThemeColors(value: Record<string, unknown>) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('themeColors must be an object.');
    }

    const normalized: Record<string, string> = { ...APP_CONFIG_DEFAULT_THEME_COLORS };
    APP_CONFIG_THEME_KEYS.forEach((key) => {
      const candidate = value[key];
      if (candidate === undefined || candidate === null || String(candidate).trim() === '') {
        return;
      }

      const color = String(candidate).trim();
      if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
        throw new BadRequestException(`themeColors.${key} is invalid.`);
      }

      normalized[key] = color;
    });

    return normalized;
  }

  private normalizeThemeColorsFromStorage(value: Prisma.JsonValue) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return { ...APP_CONFIG_DEFAULT_THEME_COLORS };
    }

    const source = value as Record<string, unknown>;
    return this.normalizeThemeColors(source);
  }

  private sanitizeUiString(value: unknown, fieldName: string, maxLength: number) {
    const sanitized = sanitizeHtml(String(value || ''), {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();

    if (!sanitized) {
      throw new BadRequestException(`${fieldName} is empty after sanitization.`);
    }

    if (sanitized.length > maxLength) {
      throw new BadRequestException(`${fieldName} exceeds the maximum allowed length.`);
    }

    return sanitized;
  }

  private assertAdmin(actor: AuthenticatedUser) {
    if (actor.role !== AppRole.ADMIN) {
      throw new ForbiddenException('Only admins may update app configuration.');
    }
  }
}
