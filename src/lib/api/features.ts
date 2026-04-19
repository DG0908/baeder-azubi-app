import { apiRequest } from '../secureApiClient';

export type FeatureAccessMap = Record<string, boolean>;

export const featuresApi = {
  /**
   * GET /users/me/features — Server-computed boolean map for current user.
   * Keys sind Feature-Keys aus APP_FEATURE_REGISTRY.
   */
  me: (): Promise<FeatureAccessMap> =>
    apiRequest('/users/me/features', { method: 'GET' }) as Promise<FeatureAccessMap>
};
