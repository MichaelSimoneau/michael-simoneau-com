import { DependencyList, useEffect, useMemo } from 'react';
import type { FoundationBoundary, FoundationFeatureConfig } from './types';
import { useFoundation } from './context';

export const useFoundationFeature = <T extends keyof FoundationFeatureConfig>(feature: T) => {
  const { features } = useFoundation();
  return useMemo(() => features[feature], [features, feature]);
};

export const useFoundationMetadata = () => {
  const { metadata } = useFoundation();
  return metadata;
};

export const useFoundationAnalytics = () => {
  const { analytics } = useFoundation();
  return analytics;
};

export const useFoundationRuntime = () => {
  const { runtime } = useFoundation();
  return runtime;
};

type PageViewOptions = {
  deps?: DependencyList;
  enabled?: boolean;
};

export const useFoundationBoundary = (boundary?: FoundationBoundary) => {
  const { registerBoundary } = useFoundation();

  useEffect(() => {
    if (!boundary) {
      return;
    }

    registerBoundary(boundary);
  }, [boundary, registerBoundary]);
};

export const useFoundationPageView = (
  type: string,
  payload?: Record<string, unknown>,
  options?: PageViewOptions,
) => {
  const { analytics, runtime } = useFoundation();
  const payloadFingerprint = useMemo(() => (payload ? JSON.stringify(payload) : 'null'), [payload]);
  const providedDeps = options?.deps;
  const stableDeps = useMemo<DependencyList>(() => providedDeps ?? [], [providedDeps]);
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    analytics.track({
      type,
      payload: {
        ...payload,
        platform: runtime.platform,
        locale: runtime.locale,
        colorScheme: runtime.colorScheme ?? 'light',
        appVersion: runtime.appVersion,
      },
      timestamp: Date.now(),
    });
  }, [
    analytics,
    runtime.platform,
    runtime.locale,
    runtime.colorScheme,
    runtime.appVersion,
    type,
    payloadFingerprint,
    payload,
    enabled,
    stableDeps,
  ]);
};
