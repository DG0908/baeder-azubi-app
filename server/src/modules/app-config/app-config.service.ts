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
  APP_CONFIG_DEFAULT_FEATURE_FLAGS,
  APP_CONFIG_DEFAULT_THEME_COLORS,
  APP_CONFIG_FEATURE_FLAG_KEYS,
  APP_CONFIG_GROUP_IDS,
  APP_CONFIG_MENU_IDS,
  APP_CONFIG_PERMISSION_KEYS,
  APP_CONFIG_THEME_KEYS,
  AppFeatureFlagKey
} from './app-config.constants';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';

type AppConfigRecord = {
  id: string;
  organizationId: string;
  menuItems: Prisma.JsonValue;
  themeColors: Prisma.JsonValue;
  featureFlags: Prisma.JsonValue;
  updatedById: string | null;
  updatedAt: Date;
};

type LegacyAppConfigRecord = {
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

const APP_CONFIG_THEME_META_KEY = '__appConfigMeta';

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

    try {
      const config = await this.prisma.appConfig.findUnique({
        where: {
          organizationId: actor.organizationId
        },
        select: {
          id: true,
          organizationId: true,
          menuItems: true,
          themeColors: true,
          featureFlags: true,
          updatedById: true,
          updatedAt: true
        }
      });

      if (!config) {
        return this.buildDefaultPayload(actor.organizationId);
      }

      return this.toPayload(config);
    } catch (error) {
      if (!this.isMissingFeatureFlagsColumnError(error)) {
        throw error;
      }

      const legacyConfig = await this.prisma.appConfig.findUnique({
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

      if (!legacyConfig) {
        return this.buildDefaultPayload(actor.organizationId);
      }

      return this.toPayloadFromLegacy(legacyConfig);
    }
  }

  async updateConfig(actor: AuthenticatedUser, dto: UpdateAppConfigDto, request: Request) {
    this.assertAdmin(actor);

    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    const currentConfig = await this.getConfig(actor);
    const tolerateLegacyPayloadForFeatureFlags = dto.featureFlags !== undefined;

    const menuItems = this.normalizeMenuItemsWithFallback(
      dto.menuItems,
      currentConfig.menuItems,
      tolerateLegacyPayloadForFeatureFlags
    );
    const themeColors = this.normalizeThemeColorsWithFallback(
      dto.themeColors,
      currentConfig.themeColors,
      tolerateLegacyPayloadForFeatureFlags
    );
    const featureFlags = this.normalizeFeatureFlags(dto.featureFlags ?? currentConfig.featureFlags ?? {});
    const persistedThemeColors = this.attachFeatureFlagsMeta(themeColors, featureFlags);

    let updatedPayload: ReturnType<AppConfigService['toPayload']>;
    let updatedConfigId: string;

    try {
      const updated = await this.prisma.appConfig.upsert({
        where: {
          organizationId: actor.organizationId
        },
        create: {
          organizationId: actor.organizationId,
          menuItems,
          themeColors: persistedThemeColors,
          featureFlags,
          updatedById: actor.id
        },
        update: {
          menuItems,
          themeColors: persistedThemeColors,
          featureFlags,
          updatedById: actor.id
        },
        select: {
          id: true,
          organizationId: true,
          menuItems: true,
          themeColors: true,
          featureFlags: true,
          updatedById: true,
          updatedAt: true
        }
      });

      updatedConfigId = updated.id;
      updatedPayload = this.toPayload(updated);
    } catch (error) {
      if (!this.isMissingFeatureFlagsColumnError(error)) {
        throw error;
      }

      const updated = await this.prisma.appConfig.upsert({
        where: {
          organizationId: actor.organizationId
        },
        create: {
          organizationId: actor.organizationId,
          menuItems,
          themeColors: persistedThemeColors,
          updatedById: actor.id
        },
        update: {
          menuItems,
          themeColors: persistedThemeColors,
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

      updatedConfigId = updated.id;
      updatedPayload = this.toPayloadFromLegacy(updated);
    }

    await this.auditLogService.writeForUser(
      actor,
      'app_config.updated',
      'AppConfig',
      updatedConfigId,
      {
        organizationId: actor.organizationId,
        menuItemCount: menuItems.length,
        themeKeys: Object.keys(themeColors)
      },
      request
    );

    return updatedPayload;
  }

  private buildDefaultPayload(organizationId: string | null) {
    return {
      organizationId,
      menuItems: [],
      themeColors: { ...APP_CONFIG_DEFAULT_THEME_COLORS },
      featureFlags: { ...APP_CONFIG_DEFAULT_FEATURE_FLAGS },
      updatedById: null,
      updatedAt: null
    };
  }

  private toPayload(config: AppConfigRecord) {
    return {
      organizationId: config.organizationId,
      menuItems: this.normalizeMenuItemsFromStorage(config.menuItems),
      themeColors: this.normalizeThemeColorsFromStorage(config.themeColors),
      featureFlags: this.normalizeFeatureFlagsFromSources(config.featureFlags, config.themeColors),
      updatedById: config.updatedById,
      updatedAt: config.updatedAt.toISOString()
    };
  }

  private toPayloadFromLegacy(config: LegacyAppConfigRecord) {
    return {
      organizationId: config.organizationId,
      menuItems: this.normalizeMenuItemsFromStorage(config.menuItems),
      themeColors: this.normalizeThemeColorsFromStorage(config.themeColors),
      featureFlags: this.normalizeFeatureFlagsFromSources(null, config.themeColors),
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

  private normalizeMenuItemsWithFallback(
    value: unknown[] | undefined,
    fallback: unknown[] | undefined,
    allowFallbackOnError: boolean
  ) {
    if (value === undefined) {
      // No menuItems in the request (e.g. feature-flag-only update).
      // Re-use stored data as-is — it is already persisted, re-validating
      // it would break updates when old group values are stored in the DB.
      return this.normalizeMenuItemsFromStorage((Array.isArray(fallback) ? fallback : []) as Prisma.JsonValue[]);
    }

    try {
      return this.normalizeMenuItems(value);
    } catch (error) {
      if (!allowFallbackOnError) {
        throw error;
      }
      // Fallback: stored data may have old/unknown group values — accept as-is.
      return this.normalizeMenuItemsFromStorage((Array.isArray(fallback) ? fallback : []) as Prisma.JsonValue[]);
    }
  }

  private normalizeThemeColorsWithFallback(
    value: Record<string, unknown> | undefined,
    fallback: Record<string, unknown> | undefined,
    allowFallbackOnError: boolean
  ) {
    if (value === undefined) {
      return this.normalizeThemeColors(
        fallback && typeof fallback === 'object' && !Array.isArray(fallback)
          ? fallback
          : { ...APP_CONFIG_DEFAULT_THEME_COLORS }
      );
    }

    try {
      return this.normalizeThemeColors(value);
    } catch (error) {
      if (!allowFallbackOnError) {
        throw error;
      }
      return this.normalizeThemeColors(
        fallback && typeof fallback === 'object' && !Array.isArray(fallback)
          ? fallback
          : { ...APP_CONFIG_DEFAULT_THEME_COLORS }
      );
    }
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

  private normalizeFeatureFlags(value: Record<string, unknown>): Record<AppFeatureFlagKey, boolean> {
    const result = { ...APP_CONFIG_DEFAULT_FEATURE_FLAGS };
    for (const key of APP_CONFIG_FEATURE_FLAG_KEYS) {
      if (key in value) {
        result[key] = Boolean(value[key]);
      }
    }
    return result;
  }

  private normalizeFeatureFlagsFromStorage(value: Prisma.JsonValue): Record<AppFeatureFlagKey, boolean> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return { ...APP_CONFIG_DEFAULT_FEATURE_FLAGS };
    }
    return this.normalizeFeatureFlags(value as Record<string, unknown>);
  }

  private normalizeFeatureFlagsFromSources(
    featureFlagsValue: Prisma.JsonValue | null | undefined,
    themeColorsValue: Prisma.JsonValue | null | undefined
  ): Record<AppFeatureFlagKey, boolean> {
    const fallback = this.extractFeatureFlagsMeta(themeColorsValue);
    const persisted = this.extractFeatureFlagsOverrides(featureFlagsValue);
    return {
      ...APP_CONFIG_DEFAULT_FEATURE_FLAGS,
      ...fallback,
      ...persisted
    };
  }

  private extractFeatureFlagsOverrides(
    value: Prisma.JsonValue | null | undefined
  ): Partial<Record<AppFeatureFlagKey, boolean>> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    const source = value as Record<string, unknown>;
    const overrides: Partial<Record<AppFeatureFlagKey, boolean>> = {};
    for (const key of APP_CONFIG_FEATURE_FLAG_KEYS) {
      if (key in source) {
        overrides[key] = Boolean(source[key]);
      }
    }
    return overrides;
  }

  private extractFeatureFlagsMeta(themeColorsValue: Prisma.JsonValue | null | undefined) {
    if (!themeColorsValue || typeof themeColorsValue !== 'object' || Array.isArray(themeColorsValue)) {
      return { ...APP_CONFIG_DEFAULT_FEATURE_FLAGS };
    }

    const source = themeColorsValue as Record<string, unknown>;
    const meta = source[APP_CONFIG_THEME_META_KEY];
    if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
      return { ...APP_CONFIG_DEFAULT_FEATURE_FLAGS };
    }

    const featureFlags = (meta as Record<string, unknown>).featureFlags;
    return this.normalizeFeatureFlagsFromStorage((featureFlags ?? null) as Prisma.JsonValue);
  }

  private attachFeatureFlagsMeta(
    themeColors: Record<string, string>,
    featureFlags: Record<AppFeatureFlagKey, boolean>
  ) {
    return {
      ...themeColors,
      [APP_CONFIG_THEME_META_KEY]: {
        featureFlags
      }
    };
  }

  private isMissingFeatureFlagsColumnError(error: unknown) {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const candidate = error as { code?: string; message?: string };
    const message = String(candidate.message || '');
    return candidate.code === 'P2022' && message.toLowerCase().includes('featureflags');
  }

  private assertAdmin(actor: AuthenticatedUser) {
    if (actor.role !== AppRole.ADMIN) {
      throw new ForbiddenException('Only admins may update app configuration.');
    }
  }
}
