import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Principle } from '../../../utils/zeroParser';

interface ZeroMobileNavigationProps {
  allPrinciples: (Principle & { chapterTitle: string })[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ZeroMobileNavigation: React.FC<ZeroMobileNavigationProps> = ({
  allPrinciples,
  activeIndex,
  onSelectIndex,
  isExpanded,
  onToggleExpand,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activePrinciple = allPrinciples[activeIndex];

  // Calculate max height based on viewport - navigation bar position - 20px bottom margin
  useEffect(() => {
    if (isExpanded && containerRef.current) {
      const updateMaxHeight = () => {
        if (containerRef.current) {
          // Use requestAnimationFrame to ensure element is positioned after animation
          requestAnimationFrame(() => {
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              // Calculate available space: viewport height - container top - 20px bottom margin
              const availableSpace = window.innerHeight - rect.top - 20;
              containerRef.current.style.maxHeight = `${Math.max(availableSpace, 200)}px`; // Minimum 200px
            }
          });
        }
      };
      // Delay slightly to allow animation to start positioning
      const timeout = setTimeout(updateMaxHeight, 100);
      window.addEventListener('resize', updateMaxHeight);
      return () => {
        clearTimeout(timeout);
        window.removeEventListener('resize', updateMaxHeight);
      };
    }
  }, [isExpanded]);

  // Scroll active item into view when expanded
  useEffect(() => {
    if (isExpanded && listRef.current) {
      const activeElement = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isExpanded, activeIndex]);

  const handleSelect = (index: number) => {
    onSelectIndex(index);
    // Auto-collapse after a short delay to allow scroll animation to start
    setTimeout(() => {
      onToggleExpand();
    }, 100);
  };

  if (!activePrinciple) return null;

  return (
    <div className="relative z-40 w-full max-w-full box-border" style={{ maxWidth: '100%', width: '100%' }}>
      {/* Compact Bar */}
      <motion.button
        onClick={onToggleExpand}
        className="w-full max-w-full bg-black/40 backdrop-blur-md border border-cyan-500/20 rounded-lg shadow-lg hover:border-cyan-500/50 transition-all duration-300 px-4 py-3 flex items-center justify-between box-border"
        style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}
        aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
        aria-expanded={isExpanded}
      >
        <div className="flex-1 text-left min-w-0">
          <div className="text-xs font-mono text-cyan-400 mb-0.5 truncate">
            {activePrinciple.chapterTitle}
          </div>
          <div className="text-sm font-bold text-white truncate">
            Principle {activePrinciple.number}
          </div>
          <div className="text-xs text-cyan-100 font-light italic truncate">
            {activePrinciple.title}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-2 text-cyan-400"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>

      {/* Expanded Section Selector */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              ref={containerRef}
              className="mt-2 bg-black/60 backdrop-blur-md border border-cyan-500/20 rounded-lg shadow-lg overflow-y-auto overflow-x-hidden custom-scrollbar w-full max-w-full box-border"
              style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}
            >
              <div ref={listRef} className="pb-4 w-full max-w-full box-border" style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}>
                {allPrinciples.map((principle, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={principle.id}
                      data-index={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full max-w-full text-left px-4 py-3 border-b border-cyan-500/10 last:border-b-0 transition-all box-border break-words ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border-l-4 border-l-cyan-500'
                          : 'text-gray-300 hover:bg-white/5 hover:text-cyan-200'
                      }`}
                      style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box', wordWrap: 'break-word', overflowWrap: 'break-word' }}
                    >
                      <div className="text-xs font-mono text-cyan-400/70 mb-1">
                        {principle.chapterTitle}
                      </div>
                      <div className="text-sm font-bold text-white mb-1">
                        Principle {principle.number}
                      </div>
                      <div className="text-xs text-gray-400 font-light italic line-clamp-2">
                        {principle.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

