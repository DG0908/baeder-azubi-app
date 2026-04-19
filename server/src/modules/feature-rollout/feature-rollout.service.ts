import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import {
  computeFeatureAccessMap,
  FeatureGateUser,
  FeatureStageMap
} from '../../common/utils/feature-gate';
import { PrismaService } from '../../prisma/prisma.service';
import {
  APP_FEATURE_REGISTRY,
  FeatureDefinition,
  FeatureStage,
  getFeatureDefinition,
  isKnownFeatureKey,
  isValidStage
} from './feature-registry';

export interface FeatureRolloutSnapshot {
  features: Array<{
    key: string;
    label: string;
    stage: FeatureStage;
    defaultStage: FeatureStage;
    alwaysOn: boolean;
    requiredRoles: string[];
  }>;
  accessMap: Record<string, boolean>;
}

@Injectable()
export class FeatureRolloutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService
  ) {}

  // ─── Read API ────────────────────────────────────────────────────────────

  async getAccessMapForUser(actor: AuthenticatedUser): Promise<Record<string, boolean>> {
    const gateUser = await this.loadGateUser(actor.id);
    const orgStages = await this.loadOrgStages(actor.organizationId);
    return computeFeatureAccessMap(gateUser, orgStages);
  }

  async getRolloutSnapshot(actor: AuthenticatedUser): Promise<FeatureRolloutSnapshot> {
    const orgStages = await this.loadOrgStages(actor.organizationId);
    const gateUser = await this.loadGateUser(actor.id);
    const accessMap = computeFeatureAccessMap(gateUser, orgStages);

    const features = APP_FEATURE_REGISTRY.map((feature: FeatureDefinition) => ({
      key: feature.key,
      label: feature.label,
      stage: this.resolveStage(feature, orgStages),
      defaultStage: feature.defaultStage,
      alwaysOn: feature.alwaysOn === true,
      requiredRoles: [...feature.requiredRoles]
    }));

    return { features, accessMap };
  }

  // ─── Admin Mutations ─────────────────────────────────────────────────────

  async setFeatureStage(
    actor: AuthenticatedUser,
    featureKey: string,
    nextStage: FeatureStage,
    request: Request
  ): Promise<{ key: string; stage: FeatureStage }> {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    const feature = getFeatureDefinition(featureKey);
    if (!feature) {
      throw new NotFoundException(`Unknown feature key: ${featureKey}`);
    }

    if (feature.alwaysOn) {
      throw new BadRequestException(`Feature "${feature.key}" is always on and cannot be staged.`);
    }

    const orgStages = await this.loadOrgStages(actor.organizationId);
    const previousStage = this.resolveStage(feature, orgStages);

    const updatedStages: Record<string, FeatureStage> = { ...orgStages, [feature.key]: nextStage };

    await this.upsertFeatureStages(actor, updatedStages);

    await this.auditLogService.writeForUser(
      actor,
      'feature_rollout.stage_changed',
      'AppConfig',
      actor.organizationId,
      {
        organizationId: actor.organizationId,
        featureKey: feature.key,
        previousStage,
        nextStage
      },
      request
    );

    return { key: feature.key, stage: nextStage };
  }

  async setBetaTester(
    actor: AuthenticatedUser,
    targetUserId: string,
    isBetaTester: boolean,
    request: Request
  ): Promise<{ id: string; isBetaTester: boolean }> {
    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, isDeleted: true, isBetaTester: true, organizationId: true }
    });

    if (!target || target.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (target.isBetaTester === isBetaTester) {
      return { id: target.id, isBetaTester: target.isBetaTester };
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { isBetaTester },
      select: { id: true, isBetaTester: true }
    });

    await this.auditLogService.writeForUser(
      actor,
      'feature_rollout.beta_tester_changed',
      'User',
      targetUserId,
      {
        targetUserId,
        targetOrganizationId: target.organizationId,
        previous: target.isBetaTester,
        next: isBetaTester
      },
      request
    );

    return updated;
  }

  async setFeatureOverrides(
    actor: AuthenticatedUser,
    targetUserId: string,
    overrides: Record<string, boolean | null>,
    request: Request
  ): Promise<{ id: string; featureOverrides: Record<string, boolean> | null }> {
    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, isDeleted: true, featureOverrides: true, organizationId: true }
    });

    if (!target || target.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    const current = this.normalizeOverrides(target.featureOverrides) ?? {};
    const next: Record<string, boolean> = { ...current };
    const changes: Record<string, { previous: boolean | undefined; next: boolean | 'removed' }> = {};

    for (const [rawKey, rawValue] of Object.entries(overrides)) {
      if (!isKnownFeatureKey(rawKey)) {
        throw new BadRequestException(`Unknown feature key: ${rawKey}`);
      }
      const previous = current[rawKey];

      if (rawValue === null) {
        if (previous !== undefined) {
          delete next[rawKey];
          changes[rawKey] = { previous, next: 'removed' };
        }
        continue;
      }

      if (typeof rawValue !== 'boolean') {
        throw new BadRequestException(`featureOverrides.${rawKey} must be boolean or null.`);
      }

      if (previous !== rawValue) {
        next[rawKey] = rawValue;
        changes[rawKey] = { previous, next: rawValue };
      }
    }

    if (Object.keys(changes).length === 0) {
      return {
        id: target.id,
        featureOverrides: Object.keys(current).length === 0 ? null : current
      };
    }

    const storedValue: Prisma.InputJsonValue | typeof Prisma.JsonNull =
      Object.keys(next).length === 0 ? Prisma.JsonNull : next;

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { featureOverrides: storedValue },
      select: { id: true, featureOverrides: true }
    });

    await this.auditLogService.writeForUser(
      actor,
      'feature_rollout.user_overrides_changed',
      'User',
      targetUserId,
      {
        targetUserId,
        targetOrganizationId: target.organizationId,
        changes
      },
      request
    );

    return {
      id: updated.id,
      featureOverrides: this.normalizeOverrides(updated.featureOverrides)
    };
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private resolveStage(feature: FeatureDefinition, orgStages: FeatureStageMap): FeatureStage {
    const stored = orgStages[feature.key];
    if (isValidStage(stored)) {
      return stored;
    }
    return feature.defaultStage;
  }

  private async upsertFeatureStages(
    actor: AuthenticatedUser,
    stages: Record<string, FeatureStage>
  ): Promise<void> {
    if (!actor.organizationId) {
      throw new ForbiddenException('Your account is not assigned to an organization.');
    }

    await this.prisma.appConfig.upsert({
      where: { organizationId: actor.organizationId },
      create: {
        organizationId: actor.organizationId,
        menuItems: [],
        themeColors: {},
        featureStages: stages,
        updatedById: actor.id
      },
      update: {
        featureStages: stages,
        updatedById: actor.id
      }
    });
  }

  private async loadGateUser(userId: string): Promise<FeatureGateUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        isBetaTester: true,
        featureOverrides: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return {
      role: user.role,
      isBetaTester: user.isBetaTester === true,
      featureOverrides: this.normalizeOverrides(user.featureOverrides)
    };
  }

  private async loadOrgStages(organizationId: string | null): Promise<FeatureStageMap> {
    if (!organizationId) {
      return {};
    }

    const config = await this.prisma.appConfig.findUnique({
      where: { organizationId },
      select: { featureStages: true }
    });

    return this.normalizeStages(config?.featureStages ?? null);
  }

  private normalizeOverrides(value: Prisma.JsonValue | null | undefined): Record<string, boolean> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    const source = value as Record<string, unknown>;
    const result: Record<string, boolean> = {};
    for (const [key, raw] of Object.entries(source)) {
      if (typeof raw === 'boolean') {
        result[key] = raw;
      }
    }
    return Object.keys(result).length === 0 ? null : result;
  }

  private normalizeStages(value: Prisma.JsonValue | null | undefined): FeatureStageMap {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    const source = value as Record<string, unknown>;
    const result: FeatureStageMap = {};
    for (const [key, raw] of Object.entries(source)) {
      if (isValidStage(raw)) {
        result[key] = raw;
      }
    }
    return result;
  }
}
