import type { DeepPartial, Foundation, FoundationEvent } from './types';

export const foundationConfig: DeepPartial<Foundation> = {
  metadata: {
    siteName: 'Michael Simoneau',
    defaultTitle: 'Michael Simoneau | Enterprise Architect & Technology Leader',
    description:
      'Discover how Michael Simoneau leads enterprise architecture, AI strategy, and large-scale transformations for highly regulated organizations.',
    canonicalUrl: 'https://michaelsimoneau.com/',
    keywords: [
      'Michael Simoneau',
      'Michael Simoneau technology leader',
      'Michael Simoneau enterprise architect',
      'CTO advisor Michael Simoneau',
      'Michael Simoneau digital transformation',
      'Michael Simoneau AI strategy',
    ],
    image: {
      default: 'https://michaelsimoneau.com/profile-image.png',
      alt: 'Portrait of Michael Simoneau',
      social: 'https://michaelsimoneau.com/profile-image.png',
    },
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Michael Simoneau | Enterprise Architect & Technology Leader',
        url: 'https://michaelsimoneau.com/',
        description:
          'Explore the enterprise architecture, AI strategy, and transformation leadership of Michael Simoneau, a trusted advisor to CTOs and executive teams.',
        inLanguage: 'en-US',
        primaryImageOfPage: 'https://michaelsimoneau.com/profile-image.png',
        about: {
          '@type': 'Person',
          name: 'Michael Simoneau',
          jobTitle: 'Enterprise Architect & Technology Leader',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Michael Simoneau',
        url: 'https://michaelsimoneau.com/',
        jobTitle: 'Enterprise Architect & Technology Leader',
        description:
          'Michael Simoneau architects resilient systems for highly regulated industries, blending AI innovation, zero-trust security, and pragmatic leadership.',
        image: 'https://michaelsimoneau.com/profile-image.png',
        sameAs: [
          'https://www.linkedin.com/in/MichaelSimoneau',
          'https://github.com/EnigmaKeyCEO',
          'https://twitter.com/enigmakeyceo',
        ],
        knowsAbout: [
          'enterprise architecture',
          'cloud modernization',
          'AI strategy',
          'digital transformation',
          'zero trust security',
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Who is Michael Simoneau?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Michael Simoneau is an enterprise architect and CTO advisor who designs resilient platforms for highly regulated sectors, combining engineering leadership with C-suite advisory experience.',
            },
          },
          {
            '@type': 'Question',
            name: 'What industries does Michael Simoneau specialize in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Michael Simoneau partners with financial services firms, fintech disruptors, and SaaS scale-ups that demand disciplined security, data governance, and rapid product iteration.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does Michael Simoneau approach digital transformation?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Michael Simoneau guides transformation with outcome-first roadmaps, collaborative architecture councils, and transparent metrics that align engineering, product, and executive stakeholders.',
            },
          },
        ],
      },
    ],
  },
  features: {
    cryptoFabricLaunch: {
      enabled: true,
      highlightLabel: 'New launch',
      name: 'Crypto Fabric — Modular GCP Architecture & Control Center',
      description:
        'A profitability-first automation platform built by Michael Simoneau for digital-asset operators that need Cloud Run guardrails, Netlify-orchestrated mobile distribution, and real-time profit telemetry.',
      keyBenefits: [
        {
          title: 'Unified control plane',
          description:
            'Guide staking, trading, and infrastructure workloads through the same onboarding guardrails and profitability policies.',
        },
        {
          title: 'Zero-cost developer mode',
          description:
            'Prototype locally with DEV_NO_COST=true, then promote to Cloud Run when the margins and guardrail checks pass.',
        },
        {
          title: 'Mobile-first telemetry',
          description:
            'Ship white-labeled Expo apps that mirror profitability dashboards so field teams and investors stay aligned.',
        },
      ],
      cta: {
        label: 'Explore Crypto Fabric',
        href: '/crypto-fabric',
      },
    },
    cookieNotice: {
      heading: 'Cookie Notice',
      body: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
      acceptLabel: 'Accept',
      declineLabel: 'Decline',
      autoPlayOptIn: true,
    },
    voiceAssistant: {
      enabled: true,
      autoPlayDelayMs: 3000,
      voice: {
        rate: 0.8,
        pitch: 0.5,
      },
      messages: [
        'Your current stack has 14.8 months to live',
        'Michael saved JPMorgan $5,000,000 in 11 weeks',
        'Quantum vulnerability detected in your infrastructure',
        'Initiating enterprise mesh transformation protocol',
      ],
    },
  },
  analytics: {
    track: (event: FoundationEvent) => {
      if (__DEV__) {
        console.debug('[React Foundation]', event);
      }
    },
  },
};
