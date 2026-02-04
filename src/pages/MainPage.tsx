import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainNav } from '../layout/MainNav';
import { HeroSection } from '../features/profile/components/HeroSection';
import { AIInterviewSection } from '../features/interview/components/AIInterviewSection';
import { StoneXProject } from '../features/portfolio/components/StoneXProject';
import { JPMorganProject } from '../features/portfolio/components/JPMorganProject';
import { AboutMeSection } from '../features/profile/components/AboutMeSection';
import { Testimonials } from '../features/profile/components/Testimonials';
import { ServiceOffering } from '../features/profile/components/ServiceOffering';
import { CTOTriage } from '../features/profile/components/CTOTriage';
import { BlogTeaser } from '../features/blog/components/BlogTeaser';
import { ContactFooter } from '../layout/ContactFooter';
import { AnimatedBackground } from '../backgrounds/AnimatedBackground';
import { useScrollContext } from '../contexts/ScrollContext';
import { Seo } from '../foundation/seo/Seo';
import { SearchOptimizedSummary } from '../features/profile/components/SearchOptimizedSummary';
import { ZeroHero } from '../features/zero-truth/components/ZeroHero';
import { CryptoFabricHero } from '../features/cryptofabric/components/CryptoFabricHero';
// import { ThthHero } from '../features/thth/components/ThthHero';
import { ThdHero } from '../features/thd';

/** Initial height of the footer content area (px); black area grows from this to 100vh. */
const FOOTER_INITIAL_HEIGHT_PX = 320;

/** Ease-in for non-linear growth: faster growth the further you scroll; quick shrink when scrolling up. */
function easeIn(t: number): number {
  return t * t;
}

export const MainPage: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const contactSectionRef = useRef<HTMLDivElement | null>(null);
  const [footerExpansionFactor, setFooterExpansionFactor] = useState(0);
  const { registerMainScrollContainer } = useScrollContext();
  const location = useLocation();
  const keywords = useMemo(
    () => [
      'Michael Simoneau',
      'Michael Simoneau technology leader',
      'Michael Simoneau enterprise architect',
      'CTO advisor Michael Simoneau',
      'Michael Simoneau digital transformation',
      'Michael Simoneau AI strategy',
    ],
    [],
  );

  const structuredData = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Michael Simoneau | Enterprise Architect & Technology Leader',
        url: 'https://www.michaelsimoneau.com/',
        description:
          'Explore the enterprise architecture, AI strategy, and transformation leadership of Michael Simoneau, a trusted advisor to CTOs and executive teams.',
        inLanguage: 'en-US',
        primaryImageOfPage: 'https://www.michaelsimoneau.com/profile-image.png',
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
        url: 'https://www.michaelsimoneau.com/',
        jobTitle: 'Enterprise Architect & Technology Leader',
        description:
          'Michael Simoneau architects resilient systems for highly regulated industries, blending AI innovation, zero-trust security, and pragmatic leadership.',
        image: 'https://www.michaelsimoneau.com/profile-image.png',
        sameAs: [
          'https://www.linkedin.com/in/michaelsimoneau',
          'https://github.com/MichaelSimoneau',
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
          {
            '@type': 'Question',
            name: 'What services does Michael Simoneau offer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Michael Simoneau offers CTO advisory, enterprise architecture consulting, AI strategy development, legacy system modernization, and fractional executive leadership for regulated industries.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are Michael Simoneau\'s key achievements?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Michael Simoneau led a $200M system rebuild at StoneX, architected mobile platforms for JPMorgan Chase, and founded Enigma Key Industries and EtherHive LLC.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Michael Simoneau available for CTO advisory roles?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Michael Simoneau is available for fractional CTO roles, technical due diligence, and high-level advisory engagements for companies seeking rapid scaling or stabilization.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is Michael Simoneau\'s experience with AI?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Michael Simoneau integrates AI into enterprise workflows, focusing on practical automation, anomaly detection, and secure LLM deployment for financial and operational efficiency.',
            },
          },
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    document.title = "Michael Simoneau | Enterprise Architect & Technology Leader";
    if (scrollContainerRef.current) {
      registerMainScrollContainer(scrollContainerRef);
    }

    const hash = location.hash || window.location.hash;
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
  }, [registerMainScrollContainer, location.pathname, location.hash]);

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
        title="Michael Simoneau | Enterprise Architect & Technology Leader"
        description="Michael Simoneau is an Enterprise Architect & Technology Leader specializing in AI strategy, quantum cryptography, and digital transformation for JPMorgan, StoneX, and regulated industries. Discover his approach to resilient systems."
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
            description: 'Enigma Key Industries, LLC is a technology consultancy led by Michael Simoneau, specializing in enterprise architecture, AI strategy, and digital transformation.',
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

        <div id="hero" className="relative">
          <section>
            <HeroSection />
          </section>
        </div>

        <div id="interview" className="relative">
          <AIInterviewSection />
        </div>

        <div id="summary" className="relative">
          <SearchOptimizedSummary />
        </div>

        <div id="zero" className="relative">
          <ZeroHero />
        </div>

        <div id="cryptofabric" className="relative">
          <CryptoFabricHero />
        </div>

        {/* <div className="relative">
          <ThthHero />
        </div> */}

        <div id="feature" className="relative">
          <ThdHero />
        </div>

                <div id="music" className="relative">
          <motion.section
            className={`${sectionWrapperClasses} bg-gray-900/40`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-white mb-8 text-center">
                Music &amp; Poetry
              </h2>
              <div className="relative w-full rounded-lg overflow-hidden" style={{ minHeight: '80vh' }}>
                <iframe
                  src="https://www.soundon.global/bio/immikecrane"
                  title="Mike Crane on SoundOn"
                  className="w-full border-0"
                  style={{ height: '80vh', minHeight: '600px' }}
                />
              </div>
            </div>
          </motion.section>
        </div>

        <div id="profile" className="relative">
          <motion.section
            id="about-me"
            className={`${sectionWrapperClasses}`}
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true, amount: 0.2}}
            transition={{duration: 0.7}}
          >
            <AboutMeSection />
          </motion.section>
        </div>

        <div id="testimonials" className="relative">
          <motion.section
            id="testimonials"
            className={`${sectionWrapperClasses} bg-gray-900/40`}
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true, amount: 0.2}}
            transition={{duration: 0.7}}
          >
            <Testimonials />
          </motion.section>
        </div>

        <div id="expertise" className="relative">
          <motion.section
            id="expertise"
            className={`${sectionWrapperClasses} bg-gray-900/40`}
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true, amount: 0.2}}
            transition={{duration: 0.7}}
          >
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">
                Proven <span className="text-cyan-400">Expertise</span> & Impact
              </h2>
              <StoneXProject />
              <JPMorganProject />
            </div>
          </motion.section>
        </div>

        <div id="services" className="relative">
          <motion.section
            id="service-offerings"
            className={`${sectionWrapperClasses}`}
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true, amount: 0.2}}
            transition={{duration: 0.7}}
          >
            <ServiceOffering />
          </motion.section>
        </div>

        <div id="triage" className="relative">
          <motion.section
            id="cto-triage"
            className={`${sectionWrapperClasses} bg-gray-900/40`}
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true, amount: 0.2}}
            transition={{duration: 0.7}}
          >
            <CTOTriage />
          </motion.section>
        </div>

        <div id="blog" className="relative">
          <BlogTeaser />
        </div>

        <div
          id="contact"
          ref={contactSectionRef}
          className="relative bg-gradient-to-b from-transparent to-black"
          style={{ height: '100vh', marginTop: '-50vh' }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center text-white"
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