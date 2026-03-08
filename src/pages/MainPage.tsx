import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { usePathname } from 'expo-router';
import { motion } from 'framer-motion';
import { MainNav } from '../layout/MainNav';
import { HeroSection } from '../features/profile/components/HeroSection';
import { VideoHeroSection } from '../features/profile/components/VideoHeroSection';
import { AIInterviewSection } from '../features/interview/components/AIInterviewSection';
import { StoneXProject } from '../features/portfolio/components/StoneXProject';
import { JPMorganProject } from '../features/portfolio/components/JPMorganProject';
import { AboutMeSection } from '../features/profile/components/AboutMeSection';
import { Testimonials } from '../features/profile/components/Testimonials';
import { BlogTeaser } from '../features/blog/components/BlogTeaser';
import { ContactFooter } from '../layout/ContactFooter';
import { AnimatedBackground } from '../backgrounds/AnimatedBackground';
import { useScrollContext } from '../contexts/ScrollContext';
import { Seo } from '../foundation/seo/Seo';
import { ZeroHero } from '../features/zero-truth/components/ZeroHero';
import { ZerothTheorySection } from '../features/zero-truth/components/ZerothTheorySection';
import { CryptoFabricHero } from '../features/cryptofabric/components/CryptoFabricHero';
import { ThdHero } from '../features/thd';
import { blogData } from '../data/blogData';

/** Initial height of the footer content area (px); black area grows from this to 100vh. */
const FOOTER_INITIAL_HEIGHT_PX = 320;

/** Ease-in for non-linear growth: faster growth the further you scroll; quick shrink when scrolling up. */
function easeIn(t: number): number {
  return t * t;
}

/**
 * SoundOnEmbed – renders the SoundOn bio iframe at full content height (no inner scroll).
 *
 * Cross-origin iframes cannot be measured via contentDocument, so we:
 *   1. Listen for `message` events in case the remote page posts its height.
 *   2. Fall back to a generous default height (2400px) that covers typical bio pages.
 *   3. Set scrolling="no" so the iframe never shows its own scrollbar.
 */
const SOUNDON_DEFAULT_HEIGHT = 2400;

const SOUNDON_BIO_URL = 'https://www.soundon.global/bio/immikecrane';
const IFRAME_LOAD_TIMEOUT_MS = 8000;

const SoundOnEmbed: React.FC = () => {
  const [iframeHeight, setIframeHeight] = useState(SOUNDON_DEFAULT_HEIGHT);
  const [loadFailed, setLoadFailed] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Accept height messages from the SoundOn origin
      if (
        typeof e.data === 'object' &&
        e.data !== null &&
        typeof e.data.height === 'number' &&
        e.data.height > 0
      ) {
        setIframeHeight(e.data.height);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (hasLoaded) return;
    const timeoutId = setTimeout(() => {
      setLoadFailed(true);
    }, IFRAME_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timeoutId);
  }, [hasLoaded]);

  const handleIframeLoad = useCallback(() => {
    setHasLoaded(true);
    setLoadFailed(false);
  }, []);

  const containerStyle: CSSProperties = {
    width: '100vw',
    maxHeight: '150vh',
    overflow: 'hidden',
  };

  const iframeStyle: CSSProperties = {
    width: '100vw',
    height: `${iframeHeight}px`,
    border: 'none',
    overflow: 'hidden',
    display: 'block',
  };

  return (
    <div id="music" className="relative" style={containerStyle}>
      {loadFailed ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-gray-900/60 text-white">
          <p className="text-lg text-gray-300 mb-4">
            Michael&apos;s Music Preview failed to load, view on SoundOn:
          </p>
          <a
            href={SOUNDON_BIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            Michael Simoneau is &apos;Mike Crane&apos;
          </a>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={SOUNDON_BIO_URL}
          title="Mike Crane on SoundOn"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          scrolling="no"
          style={iframeStyle}
          onLoad={handleIframeLoad}
        />
      )}
    </div>
  );
};

export const MainPage: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const contactSectionRef = useRef<HTMLDivElement | null>(null);
  const [footerExpansionFactor, setFooterExpansionFactor] = useState(0);
  const { registerMainScrollContainer } = useScrollContext();
  const location = usePathname();
  const keywords = useMemo(
    () => [
      'Michael Simoneau',
      'Michael Simoneau The Human Dollar',
      'Michael Simoneau 65535',
      'Michael Simoneau Genesis Dividend',
      'Michael Simoneau put it to work',
      'Michael Simoneau Zeroth Theory',
      'Michael Simoneau enterprise architect',
      'Michael Simoneau The Human Dollar',
      'Michael Simoneau #WEB',
      'Michael Simoneau Crypto Fabric',
    ],
    [],
  );
  const latestBlog = useMemo(() => {
    if (blogData.length === 0) {
      return undefined;
    }

    return blogData.reduce((latest, current) => {
      const latestTime = new Date(latest.date).getTime();
      const currentTime = new Date(current.date).getTime();
      return currentTime > latestTime ? current : latest;
    });
  }, []);

  // NOTE: The canonical Person structured data lives in index.html (always present for crawlers).
  // This useMemo only adds page-specific schemas (WebPage, FAQ) that the Seo component
  // injects/removes dynamically as the user navigates between routes.
  const structuredData = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Michael Simoneau | Architect of Zeroth Theory (#ZerothTheory)',
        url: 'https://www.michaelsimoneau.com/',
        description:
          'From enterprise architecture at JPMorgan and StoneX to building The Human Dollar (#THD). THD is your employee — $655 for every $1 put to work at the $65,535 cap. Stagnation is a firing offense. Built on Zeroth Theory, Crypto Fabric, and The Human Dollar.',
        inLanguage: 'en-US',
        primaryImageOfPage: 'https://www.michaelsimoneau.com/profile-image.png',
        about: {
          '@type': 'Person',
          name: 'Michael Simoneau',
          jobTitle: 'Architect of Zeroth Theory (#ZerothTheory)',
        },
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
              text: 'Michael Simoneau is a technologist and systems architect who evolved from enterprise architecture at JPMorgan Chase and StoneX into building The Human Dollar (#THD). THD is your employee — $655 for every $1 put to work at the $65,535 cap. Stagnation is a firing offense. Built on Zeroth Theory, Crypto Fabric, and The Human Dollar.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is The Human Dollar (#THD)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The Human Dollar (#THD) is an economic architecture designed by Michael Simoneau. THD is your employee — put it to work and it pays $655 for every $1 at the $65,535 cap. Stagnation is a firing offense: idle capital enters early retirement via base-three half-life. 1 THD is always redeemable for 1 USDC. It encompasses Zeroth Theory (the philosophy), Crypto Fabric (the infrastructure), and The Human Dollar (the currency).',
            },
          },
          {
            '@type': 'Question',
            name: 'What is Zeroth Theory?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Zeroth Theory is a rigorous framework exploring the nature of Zero, Energy, and Existence — the Numerical Trinity. It provides the foundational principles for The Human Dollar and the economic architecture behind it.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is The Human Dollar (THD)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The Human Dollar is money that works. THD is your employee — put it to work and earn $655 for every $1 at the $65,535 cap. Stagnation is a firing offense: idle capital enters early retirement. 1 THD is always redeemable for 1 USDC. This is Metabolic Reality, not speculation.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is Michael Simoneau\'s corporate background?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Michael Simoneau led a $200M system rebuild at StoneX, architected mobile platforms for JPMorgan Chase, and built 20+ years of engineering leadership across regulated industries. This foundation enabled his leap into building The Human Dollar.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is Crypto Fabric?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Crypto Fabric is a profitability-first automation platform built by Michael Simoneau and EtherHive, LLC. It deploys revenue-generating crypto services with zero configuration — solar-powered infrastructure with AI-driven automation.',
            },
          },
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    // document.title is managed by the <Seo /> component — do not set it here.
    if (scrollContainerRef.current) {
      registerMainScrollContainer(scrollContainerRef);
    }

    const hash = location.includes('#') ? location.split('#')[1] : window.location.hash;
    if (hash) {
      const sectionId = hash.replace(/^#/, '');
      const targetId = sectionId;
      // Delay so scroll container ref and target are in DOM (e.g. after navigate from another page)
      const timeoutId = setTimeout(() => {
        const container = scrollContainerRef.current;
        const targetElement = document.getElementById(targetId);
        if (container && targetElement) {
          const offset = 80;
          const containerRect = container.getBoundingClientRect();
          const elementRect = targetElement.getBoundingClientRect();
          const scrollTop = elementRect.top - containerRect.top + container.scrollTop - offset;
          container.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timeoutId);
    } else {
      const timeoutId = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [registerMainScrollContainer, location, window.location]);

  const updateFooterExpansion = useCallback(() => {
    const container = scrollContainerRef.current;
    const section = contactSectionRef.current;
    if (!container || !section) return;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    const zoneHeightPx = clientHeight; // 100vh = scroll container height
    const containerRect = container.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top - containerRect.top + scrollTop;
    const rawT = (scrollTop + clientHeight - sectionTop) / zoneHeightPx;
    const t = Math.min(1, Math.max(0, rawT));
    setFooterExpansionFactor(easeIn(t));
  }, []);

  useLayoutEffect(() => {
    updateFooterExpansion();
  }, [updateFooterExpansion]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let rafId: number | null = null;
    const onScrollOrResize = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateFooterExpansion();
      });
    };
    container.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      container.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [updateFooterExpansion]);

  const sectionWrapperClasses = "py-12 md:py-20 px-4 relative min-h-screen";

  return (
    <>
      <Seo
        title="Michael Simoneau | Architect of Zeroth Theory (#ZerothTheory)"
        description="From enterprise architecture at JPMorgan and StoneX to building The Human Dollar (#THD). THD is your employee — $655 for every $1 put to work. Stagnation is a firing offense. Built on Zeroth Theory, Crypto Fabric, and The Human Dollar."
        canonicalUrl="https://www.michaelsimoneau.com/"
        keywords={keywords}
        image="https://www.michaelsimoneau.com/profile-image.png"
        structuredData={[
          ...structuredData,
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.michaelsimoneau.com/'
              }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Enigma Key Industries, LLC',
            url: 'https://www.michaelsimoneau.com/',
            logo: 'https://www.michaelsimoneau.com/profile-image.png',
            founder: {
              '@type': 'Person',
              name: 'Michael Simoneau'
            },
            foundingDate: '2019',
            description: 'Enigma Key Industries, LLC — founded by Michael Simoneau — is the parent entity behind The Human Dollar (#THD), Zeroth Theory, and Crypto Fabric.',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Chesterland',
              addressRegion: 'OH',
              addressCountry: 'US'
            }
          }
        ]}
      />
      <AnimatedBackground />
      <div
        ref={scrollContainerRef}
        id="new-main-page-scroll-container"
        className="text-white h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10"
      >
        <MainNav scrollContainerId="new-main-page-scroll-container" />

        {/* === ACT I: THE INTRODUCTION === */}
        <div id="about" className="relative">
          <section>
            <HeroSection featuredBlog={latestBlog} />
          </section>
        </div>

        <div id="double-dragon" className="relative">
          <VideoHeroSection />
        </div>

        <div id="interview" className="relative">
          <AIInterviewSection />
        </div>

        {/* === ACT II: THE FOUNDATION (Corporate Past) === */}
        <div id="profile" className="relative">
          <motion.section

            className={`${sectionWrapperClasses}`}
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true, amount: 0.2}}
            transition={{duration: 0.7}}
          >
            <AboutMeSection />
          </motion.section>
        </div>

        <div id="expertise" className="relative">
          <motion.section

            className={`${sectionWrapperClasses} bg-gray-900/40`}
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true, amount: 0.2}}
            transition={{duration: 0.7}}
          >
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">
                The <span className="text-cyan-400">Credentials</span> That Built the Foundation
              </h2>
              <StoneXProject />
              <JPMorganProject />
            </div>
          </motion.section>
        </div>

        <div id="testimonials" className="relative">
          <motion.section

            className={`${sectionWrapperClasses} bg-gray-900/40`}
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true, amount: 0.2}}
            transition={{duration: 0.7}}
          >
            <Testimonials />
          </motion.section>
        </div>

        {/* === ACT III: THE INNOVATION === */}
        <div id="ZerothTheory" className="relative">
          <ZeroHero />
        </div>

        <div id="cryptofabric" className="relative">
          <CryptoFabricHero />
        </div>

        {/* === ACT IV: THE HUMAN DOLLAR === */}
        <div id="TheHumanDollar" className="relative">
          <ThdHero />
        </div>

        {/* === CREATIVE & COMMUNITY === */}
        <SoundOnEmbed />

        <div id="blog" className="relative">
          <BlogTeaser />
        </div>

        <div
          id="contact"
          ref={contactSectionRef}
          className="relative bg-gradient-to-b from-transparent to-black pointer-events-none"
          style={{ height: '100vh', marginTop: '-50vh' }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center text-white pointer-events-none"
            style={{
              height: `${FOOTER_INITIAL_HEIGHT_PX + (typeof window !== 'undefined' ? (window.innerHeight - FOOTER_INITIAL_HEIGHT_PX) * footerExpansionFactor : 0)}px`,
            }}
          >
            <ContactFooter />
          </div>
        </div>
      </div>
    </>
  );
}; 