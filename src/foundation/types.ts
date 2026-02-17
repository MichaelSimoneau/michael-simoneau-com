import type { ReactNode } from 'react';
import type { ColorSchemeName, PlatformOSType } from 'react-native';

export type FoundationStructuredData = Record<string, unknown>;

export type FoundationMetadata = {
  siteName: string;
  defaultTitle: string;
  description: string;
  canonicalUrl: string;
  keywords: string[];
  image: {
    default: string;
    alt: string;
    social?: string;
  };
  structuredData: FoundationStructuredData[];
};

export type FoundationFeatureConfig = {
  cryptoFabricLaunch: {
    enabled: boolean;
    highlightLabel: string;
    name: string;
    description: string;
    keyBenefits: Array<{
      title: string;
      description: string;
    }>;
    cta: {
      label: string;
      href: string;
    };
  };
  cookieNotice: {
    heading: string;
    body: string;
    acceptLabel: string;
    declineLabel: string;
    autoPlayOptIn: boolean;
  };
  voiceAssistant: {
    enabled: boolean;
    autoPlayDelayMs: number;
    voice: {
      rate: number;
      pitch: number;
    };
    messages: string[];
  };
};

export type FoundationRuntime = {
  platform: PlatformOSType;
  isWeb: boolean;
  locale: string;
  timezone: string;
  colorScheme: ColorSchemeName;
  appVersion?: string;
};

export type FoundationEvent = {
  type: string;
  payload?: Record<string, unknown>;
  timestamp: number;
};

export type FoundationAnalytics = {
  track: (event: FoundationEvent) => void;
};

export type FoundationBoundary = {
  id: string;
  label: string;
  description?: string;
  href?: string;
};

export type Foundation = {
  metadata: FoundationMetadata;
  features: FoundationFeatureConfig;
  runtime: FoundationRuntime;
  analytics: FoundationAnalytics;
  boundaries: FoundationBoundary[];
  registerBoundary: (boundary: FoundationBoundary) => void;
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<U>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export type FoundationProviderProps = {
  config?: DeepPartial<Foundation>;
  testID?: string;
  children: ReactNode;
};
