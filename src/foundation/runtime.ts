import { Appearance, Platform } from 'react-native';
import type { FoundationRuntime } from './types';

type ExpoManifestLike = {
  extra?: { appVersion?: unknown } | undefined;
  version?: unknown;
};

type ExpoGlobalContainer = {
  manifest?: ExpoManifestLike;
  manifest2?: ExpoManifestLike;
};

type ExpoBridge = {
  __expo?: ExpoGlobalContainer;
  expo?: ExpoGlobalContainer;
};

const getExpoBridge = (): ExpoGlobalContainer | undefined => {
  const globalWithBridge = globalThis as typeof globalThis & ExpoBridge;
  return globalWithBridge.__expo ?? globalWithBridge.expo;
};

const getLocale = () => {
  try {
    if (typeof Intl !== 'undefined') {
      const resolved = Intl.DateTimeFormat().resolvedOptions().locale;
      if (resolved) {
        return resolved;
      }
    }
  } catch (error) {
    console.warn('[foundation] Unable to resolve locale', error);
  }
  return 'en-US';
};

const getTimezone = () => {
  try {
    if (typeof Intl !== 'undefined') {
      const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (resolved) {
        return resolved;
      }
    }
  } catch (error) {
    console.warn('[foundation] Unable to resolve timezone', error);
  }
  return 'UTC';
};

const resolveAppVersion = () => {
  try {
    const expoGlobal = getExpoBridge();
    const manifest = expoGlobal?.manifest2 ?? expoGlobal?.manifest;
    const candidate = manifest?.extra?.appVersion ?? manifest?.version;
    return typeof candidate === 'string' ? candidate : undefined;
  } catch (error) {
    console.warn('[foundation] Unable to resolve app version', error);
    return undefined;
  }
};

export const resolveDefaultRuntime = (): FoundationRuntime => ({
  platform: Platform.OS,
  isWeb: Platform.OS === 'web',
  locale: getLocale(),
  timezone: getTimezone(),
  colorScheme: Appearance.getColorScheme() ?? 'light',
  appVersion: resolveAppVersion(),
});
