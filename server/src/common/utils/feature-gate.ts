import { AppRole } from '@prisma/client';
import {
  APP_FEATURE_REGISTRY,
  FeatureDefinition,
  FeatureStage,
  getFeatureDefinition,
  isValidStage
} from '../../modules/feature-rollout/feature-registry';

export interface FeatureGateUser {
  role: AppRole;
  isBetaTester: boolean;
  isOwner?: boolean;
  featureOverrides: Record<string, boolean> | null;
}

export type FeatureStageMap = Record<string, FeatureStage>;

function isAdminOrOwner(user: FeatureGateUser): boolean {
  return user.role === AppRole.ADMIN || user.isOwner === true;
}

export function resolveFeatureStage(
  feature: FeatureDefinition,
  orgStages: FeatureStageMap | null | undefined
): FeatureStage {
  const override = orgStages?.[feature.key];
  if (isValidStage(override)) {
    return override;
  }
  return feature.defaultStage;
}

export function canUserAccessFeature(
  user: FeatureGateUser,
  featureKey: string,
  orgStages: FeatureStageMap | null | undefined
): boolean {
  const feature = getFeatureDefinition(featureKey);
  if (!feature) {
    return false;
  }

  if (!feature.requiredRoles.includes(user.role)) {
    return false;
  }

  if (feature.alwaysOn) {
    return true;
  }

  const override = user.featureOverrides?.[featureKey];
  if (override === false) {
    return false;
  }

  if (isAdminOrOwner(user)) {
    return true;
  }

  if (override === true) {
    return true;
  }

  const stage = resolveFeatureStage(feature, orgStages);
  if (stage === 'stable') {
    return true;
  }
  if (stage === 'beta' && user.isBetaTester) {
    return true;
  }
  return false;
}

export function computeFeatureAccessMap(
  user: FeatureGateUser,
  orgStages: FeatureStageMap | null | undefined
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const feature of APP_FEATURE_REGISTRY) {
    result[feature.key] = canUserAccessFeature(user, feature.key, orgStages);
  }
  return result;
}
