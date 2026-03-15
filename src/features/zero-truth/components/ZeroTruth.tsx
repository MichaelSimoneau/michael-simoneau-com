import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NebulaStormBackground } from '../../../backgrounds/NebulaStormBackground';
import { Seo } from '../../../foundation/seo/Seo';
import { MainNav } from '../../../layout/MainNav';
import { parseZeroContent, ZeroContent } from '../../../utils/zeroParser';
import { ZeroMobileNavigation } from './ZeroMobileNavigation';
import {
  buildZeroTheoryPath,
  flattenZeroRouteTargets,
  getAdjacentTarget,
  resolveZeroRouteTarget,
  ZeroRouteTarget,
} from '../utils/zeroRouting';

type ZeroTruthProps = {
  chapterParam?: string;
  principalParam?: string;
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ZERO_TEXT_ASSET = require('../../../data/zero.txt');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ZERO_PREVIEW_MODULE = require('../data/zerothPreview');
const ZERO_PREVIEW_TEXT = (ZERO_PREVIEW_MODULE?.default ?? ZERO_PREVIEW_MODULE) as string;


export const ZeroTruth: React.FC<ZeroTruthProps> = ({ chapterParam, principalParam }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [content, setContent] = useState<ZeroContent | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [transitionDirection, setTransitionDirection] = useState(0);
  const [displayTarget, setDisplayTarget] = useState<ZeroRouteTarget | null>(null);
  const loadCycleRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const cycle = ++loadCycleRef.current;
    const parseAndSet = (text: string) => {
      if (!text || !text.trim()) return;
      const parsed = parseZeroContent(text);
      if (cancelled || cycle !== loadCycleRef.current) return;
      setContent(parsed);
    };

    // Fast first paint from local preview snapshot.
    parseAndSet(ZERO_PREVIEW_TEXT);

    const loadFromLocalAsset = async (): Promise<void> => {
      try {
        const asset = Asset.fromModule(ZERO_TEXT_ASSET);
        await asset.downloadAsync();
        const uri = asset.localUri ?? asset.uri;
        if (!uri) {
          return;
        }
        const response = await fetch(uri);
        if (!response.ok) {
          return;
        }
        const text = await response.text();
        parseAndSet(text);
      } catch {
        // Keep preview content if full hydration fails.
      }
    };

    void loadFromLocalAsset();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const resolved = useMemo(() => {
    if (!content) return { target: null as ZeroRouteTarget | null, shouldRedirect: false };
    return resolveZeroRouteTarget(content, chapterParam, principalParam);
  }, [content, chapterParam, principalParam]);

  const allTargets = useMemo(() => (content ? flattenZeroRouteTargets(content) : []), [content]);
  const routeTarget = resolved.target;
  const activeTarget = displayTarget ?? routeTarget;
  const nextTarget = useMemo(
    () => (content && activeTarget ? getAdjacentTarget(content, activeTarget, 'next') : null),
    [content, activeTarget],
  );
  const prevTarget = useMemo(
    () => (content && activeTarget ? getAdjacentTarget(content, activeTarget, 'prev') : null),
    [content, activeTarget],
  );

  useEffect(() => {
    if (!activeTarget) return;
    setExpandedChapterId(activeTarget.chapter.id);
  }, [activeTarget]);

  useEffect(() => {
    if (!displayTarget || allTargets.length === 0) return;
    const mapped =
      allTargets.find((target) => target.principle.id === displayTarget.principle.id) ??
      allTargets.find(
        (target) =>
          target.chapterParam === displayTarget.chapterParam &&
          target.principalParam === displayTarget.principalParam,
      ) ??
      null;
    if (mapped && mapped !== displayTarget) {
      setDisplayTarget(mapped);
    }
  }, [allTargets, displayTarget]);

  useEffect(() => {
    if (!routeTarget) return;
    if (!displayTarget) {
      setDisplayTarget(routeTarget);
      return;
    }
    if (routeTarget.principle.id === displayTarget.principle.id) return;
    setTransitionDirection(routeTarget.globalIndex > displayTarget.globalIndex ? 1 : -1);
    setDisplayTarget(routeTarget);
  }, [displayTarget, routeTarget]);

  useEffect(() => {
    if (!resolved.shouldRedirect || !routeTarget) return;
    const canonicalPath = buildZeroTheoryPath(routeTarget.chapterParam, routeTarget.principalParam);
    if (pathname !== canonicalPath) {
      router.replace(canonicalPath);
    }
  }, [pathname, resolved.shouldRedirect, routeTarget, router]);

  const syncRouteToTarget = useCallback(
    (target: ZeroRouteTarget, method: 'push' | 'replace' = 'push') => {
      const path = buildZeroTheoryPath(target.chapterParam, target.principalParam);
      if (path === pathname) return;
      if (method === 'replace') {
        router.replace(path);
      } else {
        router.push(path);
      }
    },
    [pathname, router],
  );

  const requestTransitionToTarget = useCallback((target: ZeroRouteTarget) => {
    if (!displayTarget) {
      setDisplayTarget(target);
      setExpandedChapterId(target.chapter.id);
      syncRouteToTarget(target);
      return;
    }
    if (target.principle.id === displayTarget.principle.id) return;

    setTransitionDirection(target.globalIndex > displayTarget.globalIndex ? 1 : -1);
    setDisplayTarget(target);
    setExpandedChapterId(target.chapter.id);
    syncRouteToTarget(target);
  }, [displayTarget, syncRouteToTarget]);

  if (!content || !activeTarget) {
    return (
      <>
        <NebulaStormBackground className="fixed inset-0 -z-10" />
        <MainNav />
        <div className="relative z-10 h-full min-h-0 px-4 md:px-8 pt-14 md:pt-16 pb-4 md:pb-6 max-w-7xl mx-auto flex items-center justify-center">
          <div className="bg-black/40 border border-cyan-500/30 rounded-2xl p-6 md:p-8 max-w-xl w-full text-center text-white">
            <h2 className="text-2xl font-bold text-cyan-300 mb-3">Loading Zeroth Theory</h2>
            <p className="text-cyan-100/80 text-sm">Preparing chapter content...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Zero: The Truth of Zero, Energy, and the Nature of Existence | Michael Simoneau"
        description="All That Was, All That Is, All That Ever Will Be - The Living Truth of Zero. A quantum-philosophical exploration."
        canonicalUrl={`https://www.michaelsimoneau.com${buildZeroTheoryPath(activeTarget.chapterParam, activeTarget.principalParam)}`}
        keywords={['Zero', 'Philosophy', 'Quantum', 'Existence', 'Truth', 'Michael Simoneau']}
      />
      <NebulaStormBackground className="fixed inset-0 -z-10" />
      <MainNav />
      <div className="relative z-10 h-full min-h-0 text-white pt-14 md:pt-16 pb-4 md:pb-6 px-4 md:px-8 max-w-7xl mx-auto flex flex-col overflow-hidden">
        <div className="text-center mb-3 md:mb-4 shrink-0">
          <h1 className="text-4xl md:text-7xl font-black text-cyan-400 tracking-tight">Zeroth Theory</h1>
          <p className="text-cyan-200/70 uppercase tracking-[0.4em] text-[10px] md:text-xs mt-2">
            The Numerical Trinity
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {isMobile ? (
            <div className="h-full min-h-0 flex flex-col gap-1">
              <div className="shrink-0">
                <MobileSelector
                  allTargets={allTargets}
                  activeTarget={activeTarget}
                  onSelect={requestTransitionToTarget}
                />
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <AnimatePresence
                  mode="wait"
                  initial={false}
                  custom={transitionDirection}
                >
                  {activeTarget ? (
                    <ZeroTextPanel
                      key={activeTarget.principle.id}
                      target={activeTarget}
                      nextTarget={nextTarget}
                      prevTarget={prevTarget}
                      transitionDirection={transitionDirection}
                      onNavigate={(direction) => {
                        const target = direction === 'next' ? nextTarget : prevTarget;
                        if (!target) return;
                        requestTransitionToTarget(target);
                      }}
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-6">
              <div className="lg:col-span-4 min-h-0 overflow-hidden">
                <DesktopSelector
                  content={content}
                  allTargets={allTargets}
                  activeTarget={activeTarget}
                  expandedChapterId={expandedChapterId}
                  setExpandedChapterId={setExpandedChapterId}
                  onSelect={requestTransitionToTarget}
                />
              </div>
              <div className="lg:col-span-8 min-h-0 overflow-hidden">
                <AnimatePresence
                  mode="wait"
                  initial={false}
                  custom={transitionDirection}
                >
                  {activeTarget ? (
                    <ZeroTextPanel
                      key={activeTarget.principle.id}
                      target={activeTarget}
                      nextTarget={nextTarget}
                      prevTarget={prevTarget}
                      transitionDirection={transitionDirection}
                      onNavigate={(direction) => {
                        const target = direction === 'next' ? nextTarget : prevTarget;
                        if (!target) return;
                        requestTransitionToTarget(target);
                      }}
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const HOLD_DURATION_MS = 2000;
const HOLD_SIGNAL_TTL_MS = 180;
const BOUNDARY_JITTER_GRACE_MS = 220;
const HARD_WHEEL_DELTA_PX = 120;
const HARD_WHEEL_VELOCITY = 1.5;
const HARD_TOUCH_DELTA_PX = 56;
const HARD_TOUCH_VELOCITY = 1.0;
type HoldDirection = 'next' | 'prev';

type OverscrollHoldGateOptions = {
  enabled: boolean;
  onComplete: (direction: HoldDirection) => void;
  durationMs?: number;
};

const useOverscrollHoldGate = ({ enabled, onComplete, durationMs = HOLD_DURATION_MS }: OverscrollHoldGateOptions) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [direction, setDirection] = useState<HoldDirection | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const lastSignalRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const directionRef = useRef<HoldDirection | null>(null);

  const cancel = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    holdStartRef.current = null;
    lastSignalRef.current = null;
    completedRef.current = false;
    directionRef.current = null;
    setDirection(null);
    setIsHolding(false);
    setProgress(0);
  }, []);

  const tick = useCallback(() => {
    if (!enabled || holdStartRef.current === null || lastSignalRef.current === null) {
      cancel();
      return;
    }

    const now = performance.now();
    if (now - lastSignalRef.current > HOLD_SIGNAL_TTL_MS) {
      cancel();
      return;
    }

    const elapsed = now - holdStartRef.current;
    const nextProgress = Math.min(1, elapsed / durationMs);
    setProgress(nextProgress);
    setIsHolding(true);

    if (nextProgress >= 1 && !completedRef.current && directionRef.current) {
      completedRef.current = true;
      const completedDirection = directionRef.current;
      cancel();
      onComplete(completedDirection);
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [cancel, durationMs, enabled, onComplete]);

  const signal = useCallback((nextDirection: HoldDirection) => {
    if (!enabled) return;
    const now = performance.now();
    lastSignalRef.current = now;

    if (directionRef.current !== nextDirection) {
      directionRef.current = nextDirection;
      setDirection(nextDirection);
      holdStartRef.current = now;
      setIsHolding(true);
      setProgress(0);
      completedRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    if (holdStartRef.current === null) {
      holdStartRef.current = now;
      setIsHolding(true);
      setProgress(0);
      setDirection(nextDirection);
      directionRef.current = nextDirection;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [enabled, tick]);

  useEffect(() => {
    if (!enabled) {
      cancel();
    }
  }, [enabled, cancel]);

  useEffect(() => cancel, [cancel]);

  return { progress, isHolding, direction, signal, cancel };
};

const MobileSelector: React.FC<{
  allTargets: ZeroRouteTarget[];
  activeTarget: ZeroRouteTarget;
  onSelect: (target: ZeroRouteTarget) => void;
}> = ({ allTargets, activeTarget, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const allPrinciples = useMemo(
    () =>
      allTargets.map((target) => ({
        ...target.principle,
        chapterTitle: `Chapter ${target.chapter.number}: ${target.chapter.title}`,
      })),
    [allTargets],
  );
  const activeIndex = useMemo(
    () => allTargets.findIndex((entry) => entry.principle.id === activeTarget.principle.id),
    [activeTarget.principle.id, allTargets],
  );

  return (
    <div className="w-full min-h-0">
      <ZeroMobileNavigation
        allPrinciples={allPrinciples}
        activeIndex={Math.max(activeIndex, 0)}
        onSelectIndex={(index) => {
          const target = allTargets[index];
          if (!target) return;
          onSelect(target);
        }}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded((current) => !current)}
      />
    </div>
  );
};

const DesktopSelector: React.FC<{
  content: ZeroContent;
  allTargets: ZeroRouteTarget[];
  activeTarget: ZeroRouteTarget;
  expandedChapterId: string | null;
  setExpandedChapterId: React.Dispatch<React.SetStateAction<string | null>>;
  onSelect: (target: ZeroRouteTarget) => void;
}> = ({ content, allTargets, activeTarget, expandedChapterId, setExpandedChapterId, onSelect }) => {
  return (
    <div className="h-full min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-3">
      {content.chapters.map((chapter) => {
        const isExpanded = expandedChapterId === chapter.id;
        return (
          <div key={chapter.id} className="rounded-2xl border border-cyan-500/25 bg-black/25 overflow-hidden">
            <button
              type="button"
              className="w-full text-left p-4 flex items-center justify-between"
              onClick={() => setExpandedChapterId((current) => (current === chapter.id ? null : chapter.id))}
            >
              <div>
                <p className="text-cyan-200 font-semibold text-sm uppercase tracking-widest">{`Chapter ${chapter.number}`}</p>
                <p className="text-white font-medium mt-1">{chapter.title}</p>
              </div>
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3 space-y-2"
                >
                  {chapter.principles.map((principle) => {
                    const isActive = activeTarget.principle.id === principle.id;
                    return (
                      <button
                        key={principle.id}
                        type="button"
                        className={`w-full text-left rounded-xl border px-3 py-2 text-sm ${
                          isActive
                            ? 'border-cyan-300 bg-cyan-400/20 text-cyan-100'
                            : 'border-transparent bg-white/5 text-gray-300 hover:text-white'
                        }`}
                        onClick={() => {
                          const target = allTargets.find((item) => item.principle.id === principle.id);
                          if (!target) return;
                          onSelect(target);
                        }}
                      >
                        <span className="font-mono text-xs opacity-80 mr-2">{`P${principle.number}`}</span>
                        {principle.title}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

const ZeroTextPanel: React.FC<{
  target: ZeroRouteTarget;
  nextTarget: ZeroRouteTarget | null;
  prevTarget: ZeroRouteTarget | null;
  transitionDirection: number;
  onNavigate: (direction: HoldDirection) => void;
}> = ({ target, nextTarget, prevTarget, transitionDirection, onNavigate }) => {
  const textScrollRef = useRef<HTMLDivElement>(null);
  const touchYRef = useRef<number | null>(null);
  const gestureMetaRef = useRef<{ lastTs: number; lockDirection: HoldDirection | null; lockUntil: number }>({
    lastTs: 0,
    lockDirection: null,
    lockUntil: 0,
  });
  const lastBoundarySignalAtRef = useRef<number>(0);
  const hasPrev = !!prevTarget;
  const hasNext = !!nextTarget;
  const holdGate = useOverscrollHoldGate({
    enabled: hasPrev || hasNext,
    onComplete: onNavigate,
  });
  const { cancel: cancelHold, signal: signalHold, progress: holdProgress, isHolding } = holdGate;
  const holdIntensity = isHolding ? holdProgress : 0;
  const activeFade = isHolding ? Math.max(0.35, 1 - holdProgress * 0.75) : 1;

  useEffect(() => {
    cancelHold();
    gestureMetaRef.current = { lastTs: 0, lockDirection: null, lockUntil: 0 };
    lastBoundarySignalAtRef.current = 0;
    if (textScrollRef.current) {
      textScrollRef.current.scrollTop = 0;
    }
  }, [cancelHold, target.principle.id]);

  const classifyGestureIntent = useCallback((deltaY: number, source: 'wheel' | 'touch', now: number) => {
    const previousTs = gestureMetaRef.current.lastTs;
    const elapsed = previousTs > 0 ? Math.max(16, now - previousTs) : 16;
    const magnitude = Math.abs(deltaY);
    const velocity = magnitude / elapsed;
    const isStrong =
      source === 'wheel'
        ? magnitude >= HARD_WHEEL_DELTA_PX || velocity >= HARD_WHEEL_VELOCITY
        : magnitude >= HARD_TOUCH_DELTA_PX || velocity >= HARD_TOUCH_VELOCITY;
    return { isStrong, magnitude, velocity };
  }, []);

  const signalBoundary = useCallback(
    (deltaY: number, source: 'wheel' | 'touch') => {
      const container = textScrollRef.current;
      if (!container) return;
      const now = performance.now();
      const direction: HoldDirection = deltaY > 0 ? 'next' : 'prev';
      const oppositeDirection: HoldDirection = direction === 'next' ? 'prev' : 'next';
      const { isStrong, magnitude } = classifyGestureIntent(deltaY, source, now);
      const isWithinLockWindow =
        gestureMetaRef.current.lockDirection === direction && now <= gestureMetaRef.current.lockUntil;

      const atTop = container.scrollTop <= 1;
      const atBottom = Math.abs(container.scrollHeight - container.clientHeight - container.scrollTop) <= 1;
      const canGoNext = atBottom && hasNext;
      const canGoPrev = atTop && hasPrev;

      if (canGoNext && direction === 'next') {
        if (isStrong) {
          gestureMetaRef.current.lockDirection = 'next';
          gestureMetaRef.current.lockUntil = now + BOUNDARY_JITTER_GRACE_MS;
        }
        signalHold('next');
        lastBoundarySignalAtRef.current = now;
        gestureMetaRef.current.lastTs = now;
        return;
      }

      if (canGoPrev && direction === 'prev') {
        if (isStrong) {
          gestureMetaRef.current.lockDirection = 'prev';
          gestureMetaRef.current.lockUntil = now + BOUNDARY_JITTER_GRACE_MS;
        }
        signalHold('prev');
        lastBoundarySignalAtRef.current = now;
        gestureMetaRef.current.lastTs = now;
        return;
      }

      // Suppress accidental reverse jitter immediately after a strong boundary intent.
      const withinRecentSignalWindow = now - lastBoundarySignalAtRef.current <= BOUNDARY_JITTER_GRACE_MS;
      const shouldIgnoreReverseJitter =
        withinRecentSignalWindow &&
        (gestureMetaRef.current.lockDirection === oppositeDirection || isWithinLockWindow) &&
        magnitude < HARD_TOUCH_DELTA_PX;

      if (shouldIgnoreReverseJitter) {
        gestureMetaRef.current.lastTs = now;
        return;
      }

      if (deltaY > 0 && !canGoNext) {
        gestureMetaRef.current.lockDirection = null;
        cancelHold();
        gestureMetaRef.current.lastTs = now;
        return;
      }

      if (deltaY < 0 && !canGoPrev) {
        gestureMetaRef.current.lockDirection = null;
        cancelHold();
        gestureMetaRef.current.lastTs = now;
        return;
      }

      gestureMetaRef.current.lockDirection = null;
      cancelHold();
    },
    [cancelHold, classifyGestureIntent, hasNext, hasPrev, signalHold],
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      signalBoundary(event.deltaY, 'wheel');
    },
    [signalBoundary],
  );

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    cancelHold();
    touchYRef.current = event.touches[0]?.clientY ?? null;
  }, [cancelHold]);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const currentY = event.touches[0]?.clientY;
    if (currentY == null || touchYRef.current == null) return;
    const deltaY = touchYRef.current - currentY;
    touchYRef.current = currentY;
    signalBoundary(deltaY, 'touch');
  }, [signalBoundary]);

  const handleTouchEnd = useCallback(() => {
    cancelHold();
    touchYRef.current = null;
  }, [cancelHold]);

  return (
    <motion.div
      custom={transitionDirection}
      initial={{ opacity: 0, x: transitionDirection >= 0 ? 80 : -80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: transitionDirection >= 0 ? -80 : 80 }}
      transition={{
        x: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.3 },
      }}
      className="h-full min-h-0 w-full flex items-stretch justify-center"
    >
      <div
        className="w-full max-w-4xl h-full max-h-full min-h-0 lg:max-h-[780px] bg-black/20 backdrop-blur-md rounded-2xl border px-6 md:px-10 py-6 md:py-8 flex flex-col"
        style={{
          borderColor: `rgba(34,211,238,${0.35 + holdIntensity * 0.65})`,
          boxShadow: `0 0 ${20 + holdIntensity * 45}px rgba(34,211,238,${0.15 + holdIntensity * 0.35})`,
        }}
      >
        <motion.div style={{ opacity: activeFade }} className="flex flex-col min-h-0 h-full">
          <h2 className="text-base md:text-xl font-semibold leading-snug text-white mb-3 md:mb-4 shrink-0">
            {target.principle.title}
          </h2>
          <div
            ref={textScrollRef}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar pr-3 text-gray-100 leading-relaxed"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {target.principle.content.split('\n').filter(Boolean).map((paragraph, index) => (
              <p key={index} className="mb-5">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden shrink-0">
            <motion.div
              className="h-full bg-cyan-400"
              animate={{ width: `${isHolding ? holdProgress * 100 : 0}%` }}
              transition={{ ease: 'linear', duration: 0.08 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
