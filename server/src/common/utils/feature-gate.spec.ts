import { AppRole } from '@prisma/client';
import {
  canUserAccessFeature,
  computeFeatureAccessMap,
  FeatureGateUser,
  resolveFeatureStage
} from './feature-gate';
import {
  APP_FEATURE_REGISTRY,
  getFeatureDefinition
} from '../../modules/feature-rollout/feature-registry';

const baseUser: FeatureGateUser = {
  role: AppRole.AZUBI,
  isBetaTester: false,
  isOwner: false,
  featureOverrides: null
};

describe('feature-gate', () => {
  describe('canUserAccessFeature', () => {
    it('returns false for unknown feature keys', () => {
      expect(canUserAccessFeature(baseUser, 'nonexistent-feature', {})).toBe(false);
    });

    it('hard-blocks users whose role is not in requiredRoles', () => {
      expect(canUserAccessFeature(baseUser, 'admin', {})).toBe(false);
      expect(canUserAccessFeature(baseUser, 'trainer-dashboard', {})).toBe(false);
    });

    it('allows users with matching role for stable features', () => {
      expect(canUserAccessFeature(baseUser, 'quiz', {})).toBe(true);
    });

    it('blocks Azubi from beta features without isBetaTester flag', () => {
      expect(canUserAccessFeature(baseUser, 'quiz', { quiz: 'beta' })).toBe(false);
    });

    it('allows Azubi Beta-Tester to see beta features', () => {
      const betaUser: FeatureGateUser = { ...baseUser, isBetaTester: true };
      expect(canUserAccessFeature(betaUser, 'quiz', { quiz: 'beta' })).toBe(true);
    });

    it('blocks Azubi Beta-Tester from alpha features', () => {
      const betaUser: FeatureGateUser = { ...baseUser, isBetaTester: true };
      expect(canUserAccessFeature(betaUser, 'quiz', { quiz: 'alpha' })).toBe(false);
    });

    it('always admits Admin to features regardless of stage', () => {
      const admin: FeatureGateUser = { ...baseUser, role: AppRole.ADMIN };
      expect(canUserAccessFeature(admin, 'quiz', { quiz: 'alpha' })).toBe(true);
      expect(canUserAccessFeature(admin, 'quiz', { quiz: 'beta' })).toBe(true);
    });

    it('treats isOwner as admin for stage purposes', () => {
      const owner: FeatureGateUser = {
        ...baseUser,
        role: AppRole.AUSBILDER,
        isOwner: true
      };
      expect(canUserAccessFeature(owner, 'quiz', { quiz: 'alpha' })).toBe(true);
    });

    it('still blocks owner if role is not in requiredRoles', () => {
      const owner: FeatureGateUser = {
        ...baseUser,
        role: AppRole.AZUBI,
        isOwner: true
      };
      expect(canUserAccessFeature(owner, 'admin', {})).toBe(false);
    });

    it('respects explicit per-user opt-in override for alpha features', () => {
      const user: FeatureGateUser = {
        ...baseUser,
        featureOverrides: { quiz: true }
      };
      expect(canUserAccessFeature(user, 'quiz', { quiz: 'alpha' })).toBe(true);
    });

    it('respects explicit per-user opt-out override even for stable features', () => {
      const user: FeatureGateUser = {
        ...baseUser,
        featureOverrides: { quiz: false }
      };
      expect(canUserAccessFeature(user, 'quiz', { quiz: 'stable' })).toBe(false);
    });

    it('per-user opt-out blocks admin too (explicit exclusion wins over admin-bypass)', () => {
      const admin: FeatureGateUser = {
        ...baseUser,
        role: AppRole.ADMIN,
        featureOverrides: { quiz: false }
      };
      expect(canUserAccessFeature(admin, 'quiz', {})).toBe(false);
    });

    it('alwaysOn features ignore stage and overrides, only require role match', () => {
      const user: FeatureGateUser = {
        ...baseUser,
        featureOverrides: { home: false }
      };
      expect(canUserAccessFeature(user, 'home', { home: 'alpha' })).toBe(true);
      expect(canUserAccessFeature(user, 'profile', { profile: 'alpha' })).toBe(true);
    });

    it('falls back to default stage when orgStages entry is invalid', () => {
      expect(canUserAccessFeature(baseUser, 'quiz', { quiz: 'not-a-stage' as never })).toBe(true);
    });

    it('handles null featureOverrides without crashing', () => {
      expect(canUserAccessFeature({ ...baseUser, featureOverrides: null }, 'quiz', {})).toBe(true);
    });
  });

  describe('resolveFeatureStage', () => {
    it('returns defaultStage when no override is present', () => {
      const feature = getFeatureDefinition('quiz')!;
      expect(resolveFeatureStage(feature, {})).toBe(feature.defaultStage);
    });

    it('uses org override when valid', () => {
      const feature = getFeatureDefinition('quiz')!;
      expect(resolveFeatureStage(feature, { quiz: 'alpha' })).toBe('alpha');
    });

    it('ignores invalid org override', () => {
      const feature = getFeatureDefinition('quiz')!;
      expect(resolveFeatureStage(feature, { quiz: 'garbage' as never })).toBe(feature.defaultStage);
    });
  });

  describe('computeFeatureAccessMap', () => {
    it('returns a boolean for every registry entry', () => {
      const map = computeFeatureAccessMap(baseUser, {});
      for (const feature of APP_FEATURE_REGISTRY) {
        expect(map).toHaveProperty(feature.key);
        expect(typeof map[feature.key]).toBe('boolean');
      }
    });

    it('gives admin access to every registry entry by default', () => {
      const admin: FeatureGateUser = { ...baseUser, role: AppRole.ADMIN };
      const map = computeFeatureAccessMap(admin, {});
      for (const feature of APP_FEATURE_REGISTRY) {
        expect(map[feature.key]).toBe(true);
      }
    });

    it('denies AZUBI access to admin-only features', () => {
      const map = computeFeatureAccessMap(baseUser, {});
      expect(map['admin']).toBe(false);
      expect(map['trainer-dashboard']).toBe(false);
    });
  });
});
