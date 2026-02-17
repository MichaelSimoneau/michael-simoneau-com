import { resolveDefaultRuntime } from './runtime';
import type { Foundation } from './types';

export const defaultFoundationConfig: Foundation = {
  metadata: {
    siteName: 'React Foundation',
    defaultTitle: 'React Foundation Application',
    description: 'A React experience bootstrapped with React Foundation.',
    canonicalUrl: 'https://michaelsimoneau.com/',
    keywords: ['react', 'foundation'],
    image: {
      default: 'https://michaelsimoneau.com/profile-image.png',
      alt: 'React Foundation logo',
    },
    structuredData: [],
  },
  features: {
    cryptoFabricLaunch: {
      enabled: false,
      highlightLabel: 'Preview',
      name: 'New capability',
      description: 'Feature description goes here.',
      keyBenefits: [],
      cta: {
        label: 'Learn more',
        href: '/crypto-fabric',
      },
    },
    cookieNotice: {
      heading: 'Cookie Notice',
      body: 'We use cookies to enhance your experience.',
      acceptLabel: 'Accept',
      declineLabel: 'Decline',
      autoPlayOptIn: false,
    },
    voiceAssistant: {
      enabled: false,
      autoPlayDelayMs: 0,
      voice: {
        rate: 1,
        pitch: 1,
      },
      messages: [],
    },
  },
  runtime: resolveDefaultRuntime(),
  analytics: {
    track: event => {
      if (__DEV__) {
        console.debug('[foundation]', event);
      }
    },
  },
  boundaries: [],
  registerBoundary: () => {
    // no-op; replaced at runtime
  },
};
