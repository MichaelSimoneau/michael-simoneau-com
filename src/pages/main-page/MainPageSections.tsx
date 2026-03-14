import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "../../features/profile/components/HeroSection";
import { ThdHero } from "../../features/thd";
import { MusicSection } from "../../features/profile/components/MusicSection";
import { CryptoFabricHero } from "../../features/cryptofabric/components/CryptoFabricHero";
import { ZeroHero } from "../../features/zero-truth/components/ZeroHero";
import { StoneXProject } from "../../features/portfolio/components/StoneXProject";
import { JPMorganProject } from "../../features/portfolio/components/JPMorganProject";
import { AboutMeSection } from "../../features/profile/components/AboutMeSection";
import { Testimonials } from "../../features/profile/components/Testimonials";
import { ContactFooter } from "../../layout/ContactFooter";

const DeferredSectionFallback: React.FC = () => (
  <div className="min-h-[55vh] w-full bg-black/15" aria-hidden="true" />
);

const LazyVideoHeroSection = lazy(async () => ({
  default: (await import("../../features/profile/components/VideoHeroSection")).VideoHeroSection,
}));

const LazyAIInterviewSection = lazy(async () => ({
  default: (await import("../../features/interview/components/AIInterviewSection")).AIInterviewSection,
}));

const LazyBlogTeaser = lazy(async () => ({
  default: (await import("../../features/blog/components/BlogTeaser")).BlogTeaser,
}));

interface MainPageSectionsProps {
  contactSectionRef: React.RefObject<HTMLDivElement | null>;
  footerExpansionFactor: number;
  footerInitialHeightPx: number;
  latestBlog: React.ComponentProps<typeof HeroSection>["featuredBlog"];
  sectionWrapperClasses: string;
}

export const MainPageSections: React.FC<MainPageSectionsProps> = ({
  contactSectionRef,
  footerExpansionFactor,
  footerInitialHeightPx,
  latestBlog,
  sectionWrapperClasses,
}) => {
  return (
    <>
      <div id="audio" className="relative">
        <section>
          <HeroSection featuredBlog={latestBlog} />
        </section>
      </div>

      <div id="TheHumanDollar" className="relative">
        <ThdHero />
      </div>

      <MusicSection />

      <CryptoFabricHero />

      <div id="ZerothTheory" className="relative">
        <ZeroHero />
      </div>

      <div id="videos" className="relative">
        <Suspense fallback={<DeferredSectionFallback />}>
          <LazyVideoHeroSection />
        </Suspense>
      </div>

      <div id="interview" className="relative">
        <Suspense fallback={<DeferredSectionFallback />}>
          <LazyAIInterviewSection />
        </Suspense>
      </div>

      <div id="profile" className="relative">
        <motion.section
          className={sectionWrapperClasses}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <AboutMeSection />
        </motion.section>
      </div>

      <div id="expertise" className="relative">
        <motion.section
          className={`${sectionWrapperClasses} bg-gray-900/40`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <Testimonials />
        </motion.section>
      </div>

      <div id="blog" className="relative">
        <Suspense fallback={<DeferredSectionFallback />}>
          <LazyBlogTeaser />
        </Suspense>
      </div>

      <div
        id="contact"
        ref={contactSectionRef}
        className="relative bg-gradient-to-b from-transparent to-black pointer-events-none"
        style={{ height: "100vh", marginTop: "-50vh" }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center text-white pointer-events-none"
          style={{
            height: `${footerInitialHeightPx + (typeof window !== "undefined" ? (window.innerHeight - footerInitialHeightPx) * footerExpansionFactor : 0)}px`,
          }}
        >
          <ContactFooter />
        </div>
      </div>
    </>
  );
};
