import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NebulaStormBackground } from '../../../backgrounds/NebulaStormBackground';
import { MainNav } from '../../../layout/MainNav';
import { Seo } from '../../../foundation/seo/Seo';
import { parseZeroContent, ZeroContent, Principle } from '../../../utils/zeroParser';
import { ZeroMobileNavigation } from './ZeroMobileNavigation';

export const ZeroTruth: React.FC = () => {
  const [content, setContent] = useState<ZeroContent | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activePrincipleId, setActivePrincipleId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  // Flattened principles for easy navigation
  const allPrinciples = useMemo(() => {
    if (!content) return [];
    return content.chapters.flatMap(c => c.principles.map(p => ({ ...p, chapterTitle: c.title })));
  }, [content]);

  useEffect(() => {
    fetch('/zeroth.txt')
      .then(res => res.text())
      .then(truthText => {
        const parsed = parseZeroContent(truthText);
        setContent(parsed);
        if (parsed.chapters.length > 0) {
          setActiveChapterId(parsed.chapters[0].id);
          if (parsed.chapters[0].principles.length > 0) {
            setActivePrincipleId(parsed.chapters[0].principles[0].id);
          }
        }
      });
  }, []);

  useEffect(() => {
    // 1024px aligns with DesktopView's lg breakpoint so tablet uses mobile nav; desktop shows side-by-side only at lg+
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync mobile index with active principle
  useEffect(() => {
    if (activePrincipleId && allPrinciples.length > 0) {
      const index = allPrinciples.findIndex(p => p.id === activePrincipleId);
      if (index !== -1 && index !== mobileIndex) {
        setMobileIndex(index);
      }
    }
  }, [activePrincipleId, allPrinciples, mobileIndex]);

  const handleNext = () => {
    if (allPrinciples.length === 0) return;

    const currentIndex = allPrinciples.findIndex(p => p.id === activePrincipleId);
    if (currentIndex < allPrinciples.length - 1) {
      const next = allPrinciples[currentIndex + 1];
      setActivePrincipleId(next.id);
      
      // Update active chapter if next principle is in a different chapter
      if (content) {
        const chap = content.chapters.find(c => c.principles.some(p => p.id === next.id));
        if (chap) setActiveChapterId(chap.id);
      }
      
      if (isMobile) {
        setMobileIndex(currentIndex + 1);
      }
    }
  };

  if (!content) return null;

  return (
    <>
      <Seo
        title="Zero: The Truth of Zero, Energy, and the Nature of Existence | Michael Simoneau"
        description="All That Was, All That Is, All That Ever Will Be - The Living Truth of Zero. A quantum-philosophical exploration."
        canonicalUrl="https://www.michaelsimoneau.com/zero"
        keywords={["Zero", "Philosophy", "Quantum", "Existence", "Truth", "Michael Simoneau"]}
      />
      <NebulaStormBackground />
      <MainNav />
      
      <div className="relative min-h-screen text-white pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto flex flex-col h-screen w-full max-w-full overflow-hidden box-border">
        {/* Header / Title Area */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12 text-center flex-shrink-0"
        >
          <h1 className="text-4xl md:text-7xl font-black text-cyan-400 mb-2 md:mb-4 tracking-tighter break-words w-full">
            ZEROTH THEORY
          </h1>
          <p className="text-cyan-200/60 uppercase tracking-[0.5em] text-xs md:text-sm">
            The Numerical Trinity
          </p>
        </motion.div>

        {isMobile ? (
          <MobileView 
            content={content}
            allPrinciples={allPrinciples}
            activeIndex={mobileIndex}
            setActiveIndex={(idx) => {
              setMobileIndex(idx);
              const p = allPrinciples[idx];
              setActivePrincipleId(p.id);
               const chap = content?.chapters.find(c => c.principles.some(princ => princ.id === p.id));
               if (chap) setActiveChapterId(chap.id);
            }}
          />
        ) : (
          <div className="flex-grow overflow-auto">
            <DesktopView 
              content={content}
              activeChapterId={activeChapterId}
              setActiveChapterId={setActiveChapterId}
              activePrincipleId={activePrincipleId}
              setActivePrincipleId={setActivePrincipleId}
              onNext={handleNext}
            />
          </div>
        )}
      </div>
    </>
  );
};

// Sub-components

const MobileView: React.FC<{
  content: ZeroContent;
  allPrinciples: (Principle & { chapterTitle: string })[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}> = ({ allPrinciples, activeIndex, setActiveIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTopRef = useRef(0);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  // Sync scroll position when activeIndex changes programmatically (e.g. from nav buttons)
  // NOTE: This should NOT run when handleSelectIndex is called, as that function handles scrolling itself
  useLayoutEffect(() => {
    // Skip if scroll lock is active (means handleSelectIndex is handling it)
    if (isScrollingRef.current || !containerRef.current) return;
    
    const { clientHeight } = containerRef.current;
    const targetScroll = activeIndex * clientHeight;
    const currentScroll = containerRef.current.scrollTop;
    
    // Only scroll if significantly different to avoid fighting user scroll
    // Use a larger threshold to prevent micro-adjustments
    if (Math.abs(currentScroll - targetScroll) > 20) {
      isScrollingRef.current = true;
      containerRef.current.scrollTo({ 
        top: targetScroll, 
        behavior: 'smooth' 
      });
      
      // Reset scroll lock after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    } else if (Math.abs(currentScroll - targetScroll) > 2) {
      // If we're close to target, ensure we're exactly on it
      containerRef.current.scrollTop = targetScroll;
    }
  }, [activeIndex]);

  // Throttled scroll handler to prevent excessive state updates
  const handleScroll = useCallback(() => {
    // Always respect scroll lock - don't update during programmatic scrolling
    if (!containerRef.current || isScrollingRef.current) return;
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Throttle scroll updates
    scrollTimeoutRef.current = setTimeout(() => {
      // Double-check scroll lock after timeout
      if (!containerRef.current || isScrollingRef.current) return;
      
      const { scrollTop, clientHeight } = containerRef.current;
      const currentScrollTop = scrollTop;
      
      // Use simple, reliable calculation for snap scrolling
      // Each card should be exactly clientHeight tall, so scrollTop / clientHeight gives us the index
      const index = Math.round(scrollTop / clientHeight);
      
      // Clamp index to valid range
      const clampedIndex = Math.max(0, Math.min(index, allPrinciples.length - 1));
      
      // Only update if index is valid and different, and scroll has actually changed
      // Also ensure we're not in the middle of a programmatic scroll
      if (
        clampedIndex !== activeIndex && 
        clampedIndex >= 0 && 
        clampedIndex < allPrinciples.length &&
        Math.abs(currentScrollTop - lastScrollTopRef.current) > 5 &&
        !isScrollingRef.current
      ) {
        lastScrollTopRef.current = currentScrollTop;
        setActiveIndex(clampedIndex);
      }
    }, 50); // Throttle to ~20fps
  }, [activeIndex, allPrinciples.length, setActiveIndex]);

  // Calculate card height based on container
  useEffect(() => {
    const updateCardHeight = () => {
      if (containerRef.current) {
        setCardHeight(containerRef.current.clientHeight);
      }
    };
    
    updateCardHeight();
    window.addEventListener('resize', updateCardHeight);
    
    return () => {
      window.removeEventListener('resize', updateCardHeight);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isNavExpanded]);

  const handleSelectIndex = (index: number) => {
    if (!containerRef.current) return;
    
    // Set scroll lock FIRST to prevent useLayoutEffect from interfering
    isScrollingRef.current = true;
    
    // Set active index to update opacity immediately
    setActiveIndex(index);
    
    // Scroll to the selected index
    const { clientHeight } = containerRef.current;
    const targetScroll = index * clientHeight;
    containerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    
    // Reset scroll lock after animation completes
    setTimeout(() => {
      if (containerRef.current) {
        // Ensure exact position
        const currentScroll = containerRef.current.scrollTop;
        const expectedScroll = index * containerRef.current.clientHeight;
        if (Math.abs(currentScroll - expectedScroll) > 1) {
          containerRef.current.scrollTop = expectedScroll;
        }
      }
      isScrollingRef.current = false;
    }, 500);
  };

  return (
    <div className="flex flex-col flex-grow min-h-0 w-full max-w-full overflow-x-hidden box-border" style={{ maxWidth: '100%' }}>
      {/* Mobile Navigation */}
      <div className="flex-shrink-0 mb-4 w-full max-w-full box-border" style={{ maxWidth: '100%' }}>
        <ZeroMobileNavigation
          allPrinciples={allPrinciples}
          activeIndex={activeIndex}
          onSelectIndex={handleSelectIndex}
          isExpanded={isNavExpanded}
          onToggleExpand={() => setIsNavExpanded(!isNavExpanded)}
        />
      </div>

      {/* Scroll Container */}
      <div 
        id="mobile-scroll-container"
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth no-scrollbar min-w-0 w-full box-border"
        style={{ scrollBehavior: 'smooth', maxWidth: '100%', width: '100%' }}
      >
      {allPrinciples.map((principle, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div 
            key={principle.id} 
            className="snap-start flex flex-col justify-center p-2 box-border"
            style={{ 
              height: cardHeight ? `${cardHeight}px` : '100%', 
              minHeight: cardHeight ? `${cardHeight}px` : '100%',
              maxHeight: cardHeight ? `${cardHeight}px` : '100%',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
             <motion.div
               key={`${principle.id}-${isActive}`}
               initial={false}
               animate={{ 
                 opacity: isActive ? 1 : 0.3,
                 scale: isActive ? 1 : 0.95
               }}
               transition={{ 
                 duration: 0.5,
                 ease: "easeOut"
               }}
               style={{ 
                 willChange: 'opacity, transform',
                 width: '100%',
                 maxWidth: '100%',
                 boxSizing: 'border-box'
               }}
               className={`bg-black/20 backdrop-blur-md border border-cyan-500/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,255,136,0.1)] flex flex-col h-full w-full box-border ${isActive ? 'border-cyan-500/50' : ''}`}
             >
               <div 
                 className="text-gray-100 leading-relaxed text-sm flex-grow overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar drop-shadow-sm font-medium box-border"
                 style={{ 
                   width: '100%',
                   maxWidth: '100%',
                   wordWrap: 'break-word',
                   overflowWrap: 'break-word',
                   boxSizing: 'border-box'
                 }}
               >
                 {principle.content.split('\n').map((para, i) => para.trim() && (
                   <p 
                     key={i} 
                     className="mb-4 break-words"
                     style={{ 
                       width: '100%',
                       maxWidth: '100%',
                       wordWrap: 'break-word',
                       overflowWrap: 'break-word',
                       boxSizing: 'border-box'
                     }}
                   >
                     {para}
                   </p>
                 ))}
               </div>
             </motion.div>
          </div>
        );
      })}
      <div className="snap-start flex items-center justify-center text-cyan-500/50 italic" style={{ height: cardHeight ? `${cardHeight}px` : '100%' }}>
        <div className="text-center">
          <p className="mb-2">... to be continued ...</p>
          <p className="text-xs opacity-50">Drag up to glimpse the void</p>
        </div>
      </div>
      </div>
    </div>
  );
};

const DesktopView: React.FC<{
  content: ZeroContent;
  activeChapterId: string | null;
  setActiveChapterId: (id: string | null) => void;
  activePrincipleId: string | null;
  setActivePrincipleId: (id: string | null) => void;
  onNext: () => void;
}> = ({ content, activeChapterId, setActiveChapterId, activePrincipleId, setActivePrincipleId, onNext }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Left Column: Bubbly TOC */}
      <div className="lg:col-span-4 space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[70vh]">
        {content.chapters.map((chapter) => (
          <div key={chapter.id} className="relative">
             <motion.button
               onClick={() => {
                 setActiveChapterId(activeChapterId === chapter.id ? null : chapter.id);
               }}
               className={`w-full text-left p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                 activeChapterId === chapter.id 
                   ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_15px_rgba(0,255,136,0.2)]' 
                   : 'bg-black/20 border-white/10 hover:border-cyan-500/30'
               }`}
             >
               <div className="flex justify-between items-center">
                 <span className={`font-bold drop-shadow-md ${activeChapterId === chapter.id ? 'text-cyan-400' : 'text-gray-200'}`}>
                   Chapter {chapter.number}
                 </span>
                 {activeChapterId === chapter.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
               </div>
               <div className="text-sm text-gray-300 mt-1 truncate drop-shadow-sm font-medium">{chapter.title}</div>
             </motion.button>

             <AnimatePresence>
               {activeChapterId === chapter.id && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="overflow-hidden ml-4 mt-2 space-y-2 border-l-2 border-cyan-900/50 pl-4"
                 >
                   {chapter.principles.map((principle) => (
                     <button
                       key={principle.id}
                       onClick={() => setActivePrincipleId(principle.id)}
                       className={`block w-full text-left py-2 px-4 rounded-xl text-sm transition-all ${
                         activePrincipleId === principle.id
                           ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                           : 'text-gray-400 hover:text-cyan-200 hover:bg-white/5'
                       }`}
                     >
                       <span className="font-mono text-xs opacity-50 mr-2">P.{principle.number}</span>
                       {principle.title.substring(0, 40)}...
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Right Column: Content */}
      <div className="lg:col-span-8 h-full overflow-hidden">
         <AnimatePresence mode="wait">
           {activePrincipleId ? (
             <DesktopContent 
               key={activePrincipleId}
               activePrincipleId={activePrincipleId}
               content={content}
               onNext={onNext}
             />
           ) : (
             <div className="flex items-center justify-center h-full text-gray-500 italic">
               Select a principle to begin transmission...
             </div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
};

const DesktopContent: React.FC<{
  activePrincipleId: string;
  content: ZeroContent;
  onNext: () => void;
}> = ({ activePrincipleId, content, onNext }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overscrollAmount, setOverscrollAmount] = useState(0);
  const [isTriggered, setIsTriggered] = useState(false);
  const triggerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeData = useMemo(() => {
    for (const c of content.chapters) {
      const p = c.principles.find(p => p.id === activePrincipleId);
      if (p) return { principle: p, chapter: c };
    }
    return null;
  }, [activePrincipleId, content]);

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    // Check if we are at bottom
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 2;
    
    if (isAtBottom && e.deltaY > 0) {
      // Accumulate overscroll
      setOverscrollAmount(prev => Math.min(prev + e.deltaY, 200));
    } else {
      // Reset if scrolling back up or not at bottom
      setOverscrollAmount(0);
      if (triggerRef.current) {
        clearTimeout(triggerRef.current);
        triggerRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (overscrollAmount > 100 && !triggerRef.current && !isTriggered) {
      // Start trigger timer
      triggerRef.current = setTimeout(() => {
        setIsTriggered(true);
        onNext();
      }, 1500);
    } else if (overscrollAmount <= 100 && triggerRef.current) {
      // Cancel trigger if user stops pulling
      clearTimeout(triggerRef.current);
      triggerRef.current = null;
    }
  }, [overscrollAmount, isTriggered, onNext]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
       if (triggerRef.current) clearTimeout(triggerRef.current);
    };
  }, []);

  if (!activeData) return null;
  const { principle, chapter } = activeData;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="bg-transparent backdrop-blur-none border-none p-8 md:p-12 relative h-full flex flex-col"
    >
      {/* Decorative quantum elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      
      <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm mb-6 uppercase tracking-widest flex-shrink-0 drop-shadow-md">
        <span>Principle {principle.number}</span>
        <span>/</span>
        <span>Chapter {chapter.number}</span>
      </div>
      
      <div 
        ref={scrollRef}
        onWheel={handleWheel}
        className="prose prose-invert prose-lg max-w-none text-gray-100 leading-loose overflow-y-auto custom-scrollbar pr-4 flex-grow min-h-0 drop-shadow-sm font-medium relative"
      >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
            {principle.title}
          </h2>
          {principle.content.split('\n').map((paragraph, i) => (
            paragraph.trim() && <p key={i} className="mb-6">{paragraph}</p>
          ))}
          
          {/* Overscroll Indicator */}
          <motion.div 
             className="h-20 flex items-center justify-center text-cyan-400 mt-8"
             style={{ opacity: Math.min(overscrollAmount / 150, 1) }}
          >
             <div className="flex flex-col items-center animate-pulse">
                <ChevronDown size={32} />
                <span className="text-xs font-mono tracking-widest uppercase">
                  {overscrollAmount > 100 ? "Hold to Proceed..." : "Scroll to Next"}
                </span>
                {overscrollAmount > 100 && (
                   <motion.div 
                     className="h-1 bg-cyan-400 mt-2 rounded-full"
                     initial={{ width: 0 }}
                     animate={{ width: 50 }}
                     transition={{ duration: 1.5 }}
                   />
                )}
             </div>
          </motion.div>
      </div>
    </motion.div>
  );
};
