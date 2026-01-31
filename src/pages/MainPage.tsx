import React, { useEffect, useMemo, useRef } from 'react';
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
import { CryptoFabricHero } from '../features/crypto-fabric/components/CryptoFabricHero';
import { ThthHero } from '../features/thth/components/ThthHero';

export const MainPage: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { registerMainScrollContainer } = useScrollContext();
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
    
    const hash = window.location.hash;
    if (hash && scrollContainerRef.current) {
      // Remove the # from the hash to get the section ID
      const sectionId = hash.substring(1);
      const targetElement = document.getElementById(sectionId);
      
      if (targetElement) {
        // Small delay to ensure the page is fully rendered
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const offset = 80; // MainNav height
            const containerRect = scrollContainerRef.current.getBoundingClientRect();
            const elementRect = targetElement.getBoundingClientRect();
            const scrollTop = elementRect.top - containerRect.top + scrollContainerRef.current.scrollTop - offset;
            
            scrollContainerRef.current.scrollTo({
              top: scrollTop,
              behavior: 'smooth',
            });
          }
        }, 100);
      }
    } else if (!hash && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({top: 0, behavior: 'auto'});
    }
  }, [registerMainScrollContainer]);

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
        className="text-white h-screen flex flex-col overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10"
      >
        <MainNav scrollContainerId="new-main-page-scroll-container" />

        <section>
          <HeroSection />
        </section>

        <AIInterviewSection />

        <SearchOptimizedSummary />

        <ZeroHero />

        <CryptoFabricHero />

        <ThthHero />

        <div id="profile">
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

        <BlogTeaser />
        
        <section>
          <ContactFooter />
        </section>
      </div>
    </>
  );
}; 