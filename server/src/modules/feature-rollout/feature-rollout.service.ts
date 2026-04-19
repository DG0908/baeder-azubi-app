import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
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
  constructor(private readonly prisma: PrismaService) {}

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

  private resolveStage(feature: FeatureDefinition, orgStages: FeatureStageMap): FeatureStage {
    const stored = orgStages[feature.key];
    if (isValidStage(stored)) {
      return stored;
    }
    return feature.defaultStage;
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
    return result;
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
