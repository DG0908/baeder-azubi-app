import { apiRequest } from '../secureApiClient';
import type { FeatureStage, FrontendRoleKey } from '../featureRegistry';

export type FeatureAccessMap = Record<string, boolean>;

export interface FeatureRolloutSnapshotEntry {
  key: string;
  label: string;
  stage: FeatureStage;
  defaultStage: FeatureStage;
  alwaysOn: boolean;
  requiredRoles: FrontendRoleKey[];
}

export interface FeatureRolloutSnapshot {
  features: FeatureRolloutSnapshotEntry[];
  accessMap: FeatureAccessMap;
}

export const featuresApi = {
  me: (): Promise<FeatureAccessMap> =>
    apiRequest('/users/me/features', { method: 'GET' }) as Promise<FeatureAccessMap>
};

export const featureRolloutAdminApi = {
  snapshot: (): Promise<FeatureRolloutSnapshot> =>
    apiRequest('/admin/feature-rollout', { method: 'GET' }) as Promise<FeatureRolloutSnapshot>,

  setStage: (featureKey: string, stage: FeatureStage): Promise<{ key: string; stage: FeatureStage }> =>
    apiRequest(`/admin/feature-rollout/features/${encodeURIComponent(featureKey)}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage })
    }) as Promise<{ key: string; stage: FeatureStage }>
};
