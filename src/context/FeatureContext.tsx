import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { featuresApi, type FeatureAccessMap } from '../lib/api/features';
import { APP_FEATURE_REGISTRY, isKnownFeatureKey } from '../lib/featureRegistry';
import { useAuth } from './AuthContext';

interface FeatureContextValue {
  accessMap: FeatureAccessMap;
  isLoading: boolean;
  isError: boolean;
  hasFeature: (key: string) => boolean;
}

const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

/**
 * Fallback-Map wenn Query noch laeuft oder fehlschlaegt:
 * Alle stable-Features in Registry als true (konservativer Default),
 * damit Legacy-Verhalten erhalten bleibt. alwaysOn sowieso true.
 * Nicht-stable-Features sind false -> Admin bekommt Zugriff erst nach erstem Fetch.
 */
const buildFallbackMap = (): FeatureAccessMap => {
  const map: FeatureAccessMap = {};
  for (const f of APP_FEATURE_REGISTRY) {
    map[f.key] = f.alwaysOn === true || f.defaultStage === 'stable';
  }
  return map;
};

const FALLBACK_MAP = buildFallbackMap();

export function FeatureProvider({ children }: { children: ReactNode }) {
  const { user, authReady } = useAuth();
  const enabled = authReady && Boolean(user?.id);

  const query = useQuery<FeatureAccessMap>({
    queryKey: ['features', 'me', user?.id ?? 'anon'],
    queryFn: () => featuresApi.me(),
    enabled,
    staleTime: 5 * 60 * 1000
  });

  const value = useMemo<FeatureContextValue>(() => {
    const accessMap = query.data ?? FALLBACK_MAP;
    const hasFeature = (key: string): boolean => {
      if (!isKnownFeatureKey(key)) return true;
      return accessMap[key] === true;
    };
    return {
      accessMap,
      isLoading: query.isLoading,
      isError: query.isError,
      hasFeature
    };
  }, [query.data, query.isLoading, query.isError]);

  return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>;
}

export function useFeatureContext(): FeatureContextValue {
  const ctx = useContext(FeatureContext);
  if (!ctx) {
    throw new Error('useFeatureContext must be used within FeatureProvider');
  }
  return ctx;
}
