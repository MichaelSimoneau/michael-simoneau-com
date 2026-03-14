import React, { Suspense, lazy, useEffect } from "react";
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
  const hasLoggedSettledLayoutRef = React.useRef(false);
  useEffect(() => {
    const ids = ["audio", "TheHumanDollar", "music", "CryptoFabric", "ZerothTheory"];
    const snapshot = ids.map((id) => {
      const element = document.getElementById(id);
      const rect = element?.getBoundingClientRect();
      return {
        id,
        exists: Boolean(element),
        tag: element?.tagName ?? null,
        className: element?.className ?? null,
        parentTag: element?.parentElement?.tagName ?? null,
        top: typeof rect?.top === "number" ? Math.round(rect.top) : null,
        height: typeof rect?.height === "number" ? Math.round(rect.height) : null,
      };
    });

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/3249ee71-b1d0-461e-9881-1b108a38579f", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6cf5ee" },
      body: JSON.stringify({
        sessionId: "6cf5ee",
        runId: "initial",
        hypothesisId: "H1-H3",
        location: "MainPageSections.tsx:mount",
        message: "MainPage section DOM snapshot",
        data: {
          sectionSnapshot: snapshot,
          cryptoFabricIdCount: document.querySelectorAll("#CryptoFabric").length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  useEffect(() => {
    const ids = ["audio", "TheHumanDollar", "music", "CryptoFabric", "ZerothTheory"];
    const seen = new Set<string>();

    const emitPresenceLog = (id: string) => {
      if (seen.has(id)) {
        return;
      }
      const element = document.getElementById(id);
      if (!element) {
        return;
      }
      seen.add(id);
      const rect = element.getBoundingClientRect();
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/3249ee71-b1d0-461e-9881-1b108a38579f", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6cf5ee" },
        body: JSON.stringify({
          sessionId: "6cf5ee",
          runId: "initial",
          hypothesisId: "H1-H3",
          location: "MainPageSections.tsx:presence-observer",
          message: "Section id became available in DOM",
          data: {
            id,
            tag: element.tagName,
            className: element.className,
            parentTag: element.parentElement?.tagName ?? null,
            parentClassName: element.parentElement?.className ?? null,
            top: Math.round(rect.top),
            height: Math.round(rect.height),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    };

    ids.forEach((id) => emitPresenceLog(id));

    const observer = new MutationObserver(() => {
      ids.forEach((id) => emitPresenceLog(id));
      if (seen.size === ids.length) {
        // #region agent log
        fetch("http://127.0.0.1:7242/ingest/3249ee71-b1d0-461e-9881-1b108a38579f", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6cf5ee" },
          body: JSON.stringify({
            sessionId: "6cf5ee",
            runId: "initial",
            hypothesisId: "H6-H7",
            location: "MainPageSections.tsx:observer-complete",
            message: "All target anchors detected, scheduling settled layout log",
            data: { ids },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        if (!hasLoggedSettledLayoutRef.current) {
          hasLoggedSettledLayoutRef.current = true;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const settled = ids.map((id) => {
                const element = document.getElementById(id);
                const rect = element?.getBoundingClientRect();
                return {
                  id,
                  top: typeof rect?.top === "number" ? Math.round(rect.top) : null,
                  height: typeof rect?.height === "number" ? Math.round(rect.height) : null,
                  tag: element?.tagName ?? null,
                };
              });
              const byTop = [...settled]
                .filter((entry) => typeof entry.top === "number")
                .sort((a, b) => (a.top ?? 0) - (b.top ?? 0))
                .map((entry) => entry.id);
              // #region agent log
              fetch("http://127.0.0.1:7242/ingest/3249ee71-b1d0-461e-9881-1b108a38579f", {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6cf5ee" },
                body: JSON.stringify({
                  sessionId: "6cf5ee",
                  runId: "initial",
                  hypothesisId: "H6-H7",
                  location: "MainPageSections.tsx:settled-layout",
                  message: "Settled section layout after all anchors present",
                  data: {
                    domOrder: ids,
                    visualOrderByTop: byTop,
                    sections: settled,
                    fallbackCount: document.querySelectorAll(".min-h-\\[55vh\\]").length,
                  },
                  timestamp: Date.now(),
                }),
              }).catch(() => {});
              // #endregion
            });
          });
        }
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

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
