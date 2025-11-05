import { resolveDefaultRuntime } from './runtime';
import type { Foundation } from './types';

export const defaultFoundationConfig: Foundation = {
  metadata: {
    siteName: 'Michael Simoneau',
    defaultTitle: 'Michael Simoneau | Enterprise Architect & Technology Leader',
    description:
      'Architecting resilient systems and solving complex challenges for highly regulated, technology-driven organizations.',
    canonicalUrl: 'https://michaelsimoneau.com/',
    keywords: [
      'Michael Simoneau',
      'enterprise architect',
      'technology leader',
      'digital transformation',
    ],
    image: {
      default: 'https://michaelsimoneau.com/profile-image.png',
      alt: 'Portrait of Michael Simoneau',
    },
    structuredData: [],
  },
  features: {
    cryptoFabricLaunch: {
      enabled: false,
      highlightLabel: 'Spotlight',
      name: 'Crypto Fabric — Modular GCP Architecture & Control Center',
      description:
        'A profitability-first automation platform for digital-asset operators that centralizes onboarding guardrails, zero-cost evaluation, and promotion-ready Cloud Run workflows.',
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
    track: (event) => {
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
