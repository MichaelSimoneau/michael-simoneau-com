import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

/**
 * Full-screen hero section featuring the "Double Dragon Ouroboros Architecture" YouTube video
 * with a translucent black overlay and centered title text.
 * Clicking "Watch Now" removes the overlay and starts playback with sound and controls.
 */
export const VideoHeroSection: React.FC = () => {
  const videoId = '8AygigXMlS0';
  const [isWatching, setIsWatching] = useState(false);

  /** Background preview: muted, no controls, autoplay loop */
  const previewUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1`;

  /** Active viewing: unmuted, with controls, captions on by default */
  const activeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0&playsinline=1&cc_load_policy=1&cc_lang_pref=en`;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* YouTube video — absolutely positioned and scaled to cover */}
      <div className="absolute inset-0 z-0">
        <iframe
          src={isWatching ? activeUrl : previewUrl}
          title="Double Dragon Ouroboros Architecture"
          className={`absolute top-1/2 left-1/2 w-[177.78vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 border-0 ${isWatching ? '' : 'pointer-events-none'}`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>

      {/* Overlay + title — animated out when watching */}
      <AnimatePresence>
        {!isWatching && (
          <>
            {/* Translucent black overlay */}
            <motion.div
              className="absolute inset-0 z-10 bg-black/50"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />

            {/* Centered title text + Watch Now button */}
            <motion.div
              className="relative z-20 flex flex-col items-center justify-center text-center px-4"
              style={{ minHeight: '100vh' }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-5xl leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                The{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-500">
                  &ldquo;Double Dragon Ouroboros Architecture&rdquo;
                </span>
                <br />
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-300 font-semibold">
                  by Michael Simoneau
                </span>
              </motion.h2>

              <motion.button
                type="button"
                onClick={() => setIsWatching(true)}
                className="mt-10 group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Play size={22} className="group-hover:scale-110 transition-transform" />
                Watch Now
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
