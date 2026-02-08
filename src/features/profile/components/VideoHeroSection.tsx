import React from 'react';
import { motion } from 'framer-motion';

/**
 * Full-screen hero section featuring the "Double Dragon Ouroboros Architecture" YouTube video
 * with a translucent black overlay and centered title text.
 */
export const VideoHeroSection: React.FC = () => {
  const videoId = '8AygigXMlS0';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1`;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* YouTube video background — absolutely positioned and scaled to cover */}
      <div className="absolute inset-0 z-0">
        <iframe
          src={embedUrl}
          title="Double Dragon Ouroboros Architecture"
          className="absolute top-1/2 left-1/2 w-[177.78vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>

      {/* Translucent black overlay */}
      <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none" />

      {/* Centered title text */}
      <div className="relative z-20 flex items-center justify-center text-center px-4" style={{ minHeight: '100vh' }}>
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
      </div>
    </section>
  );
};
