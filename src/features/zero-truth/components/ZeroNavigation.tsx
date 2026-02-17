import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ZeroNavigationProps {
  onPrev: () => void;
  onTop: () => void;
  visible: boolean;
}

export const ZeroNavigation: React.FC<ZeroNavigationProps> = ({ onPrev, onTop, visible }) => {
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;

    if (timeDiff < 300) {
      // Double click
      onTop();
    } else {
      // Single click
      onPrev();
    }

    setLastClickTime(currentTime);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-center pointer-events-none"
        >
          <button
            onClick={handleClick}
            onTouchEnd={handleClick}
            className="group pointer-events-auto cursor-pointer py-4 px-8 select-none touch-manipulation bg-black/40 backdrop-blur-md border border-cyan-500/20 rounded-full shadow-lg hover:border-cyan-500/50 transition-all duration-300"
            aria-label="Navigation Control"
          >
            <div className="flex items-center space-x-3 text-cyan-400 font-mono text-xs md:text-sm tracking-widest uppercase">
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">Previous</span>
              <motion.span 
                className="text-lg font-bold text-cyan-300"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ^
              </motion.span>
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">Top</span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

