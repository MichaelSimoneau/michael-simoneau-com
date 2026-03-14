import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { usePathname } from "expo-router";
import { useScrollContext } from "../../contexts/ScrollContext";
import { BlogData, blogData } from "../../data/blogData";
import {
  useProfileFlowDispatch,
  useProfileFlowState,
} from "../../features/profile/flow";
import { useBeforeAndAfter } from "src/hooks/useBeforeAndAfter";

const FOOTER_INITIAL_HEIGHT_PX = 320;
const DEFAULT_SECTION_OFFSET_PX = 80;
const MAIN_SCROLL_CONTAINER_ID = "new-main-page-scroll-container";
const SECTION_WRAPPER_CLASSES = "py-12 md:py-20 px-4 relative min-h-screen";

function easeIn(t: number): number {
  return t * t;
}

const getMainPageSectionOffset = (sectionId: string): number => {
  // Music has dedicated hero padding; generic nav offset causes awkward landing.
  return sectionId === "music" ? 0 : DEFAULT_SECTION_OFFSET_PX;
};

export const useMainPageController = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const contactSectionRef = useRef<HTMLDivElement | null>(null);
  const navScrollSettleTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const { registerMainScrollContainer } = useScrollContext();
  const { footerExpansionFactor, override } = useProfileFlowState();
  const flowDispatch = useProfileFlowDispatch();
  const location = usePathname();

  const keywords = useMemo(
    () => [
      "Michael Simoneau",
      "Michael Simoneau The Human Dollar",
      "Michael Simoneau 65535",
      "Michael Simoneau Genesis Dividend",
      "Michael Simoneau put it to work",
      "Michael Simoneau Zeroth Theory",
      "Michael Simoneau enterprise architect",
      "Michael Simoneau The Human Dollar",
      "Michael Simoneau HashWeb",
      "Michael Simoneau Crypto Fabric",
    ],
    [],
  );

  const {output: latestBlog, setBefore, setAfter, setWhen} = useBeforeAndAfter<BlogData>();
  setWhen(new Date("2026-03-18 09:00"));
  setBefore(blogData.find((blog) => blog.title === "The Zero Sudoku") ?? blogData[0]);
  setAfter(Object.values(blogData).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0] ?? blogData[0]);

  const structuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Michael Simoneau | Architect of Zeroth Theory (#ZerothTheory)",
        url: "https://www.michaelsimoneau.com/",
        description:
          "From enterprise architecture at JPMorgan and StoneX to building The Human Dollar (#THD). THD is your employee — $655 for every $1 put to work at the $65,535 cap. Stagnation is a firing offense. Built on Zeroth Theory, Crypto Fabric, and The Human Dollar.",
        inLanguage: "en-US",
        primaryImageOfPage: "https://www.michaelsimoneau.com/profile-image.png",
        about: {
          "@type": "Person",
          name: "Michael Simoneau",
          jobTitle: "Architect of Zeroth Theory (#ZerothTheory)",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Who is Michael Simoneau?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Michael Simoneau is a technologist and systems architect who evolved from enterprise architecture at JPMorgan Chase and StoneX into building The Human Dollar (#THD). THD is your employee — $655 for every $1 put to work at the $65,535 cap. Stagnation is a firing offense. Built on Zeroth Theory, Crypto Fabric, and The Human Dollar.",
            },
          },
          {
            "@type": "Question",
            name: "What is The Human Dollar (#THD)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Human Dollar (#THD) is an economic architecture designed by Michael Simoneau. THD is your employee — put it to work and it pays $655 for every $1 at the $65,535 cap. Stagnation is a firing offense: idle capital enters early retirement via base-three half-life. 1 THD is always redeemable for 1 USDC. It encompasses Zeroth Theory (the philosophy), Crypto Fabric (the infrastructure), and The Human Dollar (the currency).",
            },
          },
          {
            "@type": "Question",
            name: "What is Zeroth Theory?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Zeroth Theory is a rigorous framework exploring the nature of Zero, Energy, and Existence — the Numerical Trinity. It provides the foundational principles for The Human Dollar and the economic architecture behind it.",
            },
          },
          {
            "@type": "Question",
            name: "What is The Human Dollar (THD)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Human Dollar is money that works. THD is your employee — put it to work and earn $655 for every $1 at the $65,535 cap. Stagnation is a firing offense: idle capital enters early retirement. 1 THD is always redeemable for 1 USDC. This is Metabolic Reality, not speculation.",
            },
          },
          {
            "@type": "Question",
            name: "What is Michael Simoneau's corporate background?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Michael Simoneau led a $200M system rebuild at StoneX, architected mobile platforms for JPMorgan Chase, and built 20+ years of engineering leadership across regulated industries. This foundation enabled his leap into building The Human Dollar.",
            },
          },
          {
            "@type": "Question",
            name: "What is Crypto Fabric?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Crypto Fabric is a profitability-first automation platform built by Michael Simoneau and EtherHive, LLC. It deploys revenue-generating crypto services with zero configuration — solar-powered infrastructure with AI-driven automation.",
            },
          },
        ],
      },
    ],
    [],
  );

  const resolveHashSectionId = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const hash = window.location.hash;
    if (!hash) {
      return null;
    }
    const sectionId = hash.replace(/^#/, "").split("?")[0];
    return sectionId || null;
  }, []);

  const scrollToSectionId = useCallback(
    (targetId: string, behavior: ScrollBehavior): boolean => {
      const container = scrollContainerRef.current;
      const targetElement = document.getElementById(targetId);
      if (!container || !targetElement) {
        return false;
      }

      const offset = getMainPageSectionOffset(targetId);
      flowDispatch({
        type: "NAV_HASH_RESOLVE_REQUESTED",
        sectionId: targetId,
        sectionOffsetPx: offset,
      });
      flowDispatch({ type: "NAV_SCROLL_STARTED" });
      const containerRect = container.getBoundingClientRect();
      const elementRect = targetElement.getBoundingClientRect();
      const scrollTop =
        elementRect.top - containerRect.top + container.scrollTop - offset;
      container.scrollTo({ top: scrollTop, behavior });
      if (navScrollSettleTimeoutRef.current !== null) {
        clearTimeout(navScrollSettleTimeoutRef.current);
      }
      navScrollSettleTimeoutRef.current = setTimeout(() => {
        flowDispatch({ type: "NAV_SCROLL_SETTLED" });
        navScrollSettleTimeoutRef.current = null;
      }, 350);
      return true;
    },
    [flowDispatch],
  );

  const runHashScrollWithRetry = useCallback(
    (targetId: string): (() => void) => {
      const alignThresholdPx = 8;
      const maxRetryMs = 1800;
      const retryIntervalMs = 180;
      const startedAt = Date.now();

      scrollToSectionId(targetId, "smooth");

      const retryIntervalId = setInterval(() => {
        const container = scrollContainerRef.current;
        const targetElement = document.getElementById(targetId);
        if (!container || !targetElement) {
          return;
        }
        const offset = getMainPageSectionOffset(targetId);
        const containerRect = container.getBoundingClientRect();
        const elementRect = targetElement.getBoundingClientRect();
        const desiredTop =
          elementRect.top - containerRect.top + container.scrollTop - offset;
        const drift = Math.abs(container.scrollTop - desiredTop);

        if (drift > alignThresholdPx) {
          scrollToSectionId(targetId, "auto");
        }
        if (drift <= alignThresholdPx || Date.now() - startedAt >= maxRetryMs) {
          clearInterval(retryIntervalId);
        }
      }, retryIntervalMs);

      return () => clearInterval(retryIntervalId);
    },
    [scrollToSectionId],
  );

  useEffect(() => {
    if (scrollContainerRef.current) {
      registerMainScrollContainer(scrollContainerRef);
    }

    const sectionId = resolveHashSectionId();
    if (sectionId) {
      let stopRetry = () => {};
      const timeoutId = setTimeout(() => {
        stopRetry = runHashScrollWithRetry(sectionId);
      }, 150);
      return () => {
        clearTimeout(timeoutId);
        stopRetry();
      };
    }

    const timeoutId = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "auto" });
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [
    registerMainScrollContainer,
    location,
    resolveHashSectionId,
    runHashScrollWithRetry,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let stopRetry = () => {};
    const onHashChange = () => {
      const sectionId = resolveHashSectionId();
      if (!sectionId) {
        return;
      }
      stopRetry();
      stopRetry = runHashScrollWithRetry(sectionId);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      stopRetry();
    };
  }, [resolveHashSectionId, runHashScrollWithRetry]);

  useEffect(() => {
    if (override.value.nav.section && scrollContainerRef.current) {
      const targetElement = document.getElementById(override.value.nav.section);
      if (!targetElement) {
        return;
      }
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = targetElement.getBoundingClientRect();
      const offset = getMainPageSectionOffset(override.value.nav.section);
      flowDispatch({
        type: "NAV_HASH_RESOLVE_REQUESTED",
        sectionId: override.value.nav.section,
        sectionOffsetPx: offset,
      });
      flowDispatch({ type: "NAV_SCROLL_STARTED" });
      container.scrollTo({
        top: elementRect.top - containerRect.top + container.scrollTop - offset,
        behavior: "smooth",
      });
      setTimeout(() => flowDispatch({ type: "NAV_SCROLL_SETTLED" }), 350);
    }
  }, [override.value.nav.section, flowDispatch]);

  const updateFooterExpansion = useCallback(() => {
    const container = scrollContainerRef.current;
    const section = contactSectionRef.current;
    if (!container || !section) {
      return;
    }
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    const zoneHeightPx = clientHeight;
    const containerRect = container.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top - containerRect.top + scrollTop;
    const rawT = (scrollTop + clientHeight - sectionTop) / zoneHeightPx;
    const t = Math.min(1, Math.max(0, rawT));
    flowDispatch({ type: "FOOTER_EXPANSION_UPDATED", factor: easeIn(t) });
  }, [flowDispatch]);

  useLayoutEffect(() => {
    updateFooterExpansion();
  }, [updateFooterExpansion]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }
    let rafId: number | null = null;
    const onScrollOrResize = () => {
      if (rafId != null) {
        return;
      }
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateFooterExpansion();
      });
    };
    container.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      container.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId != null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [updateFooterExpansion]);

  return {
    contactSectionRef,
    footerExpansionFactor,
    footerInitialHeightPx: FOOTER_INITIAL_HEIGHT_PX,
    keywords,
    latestBlog,
    mainScrollContainerId: MAIN_SCROLL_CONTAINER_ID,
    scrollContainerRef,
    sectionWrapperClasses: SECTION_WRAPPER_CLASSES,
    structuredData,
  };
};
