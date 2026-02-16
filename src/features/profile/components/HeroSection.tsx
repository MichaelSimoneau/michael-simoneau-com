import React from 'react';
import { motion } from 'framer-motion';
import { PlaylistAudioPlayer, Track } from '../../../ui/players/PlaylistAudioPlayer';
import { ChevronDown } from 'lucide-react';

/** Playlist tracks for the hero section audio player. */
const HERO_TRACKS: Track[] = [
  { src: '/Zeroth_Protocol_Turns_Data_Into_Organisms.mp3', title: 'Zeroth Vision' },
  { src: '/The_AI_Built_for_Deterministic_Crypto.mp3', title: 'The AI Built for Deterministic Crypto' },
  { src: '/Building_Web_4_With_Money_That_Lives.mp3', title: 'Building Web4 With Money That Lives' },
  { src: '/Coding_A_Failover_System_For_Reality.mp3', title: 'Coding A Failover System For Reality' },
  { src: '/Systems_Engineering_for_the_Soul.mp3', title: 'Systems Engineering for the Soul' },
  { src: '/The_Birth_Certificate_of_a_Digital_Organism.mp3', title: 'The Birth Certificate of a Digital Organism' },
];



export const HeroSection: React.FC = () => {
  return (
    <section 
      id="new-hero"
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-16 relative overflow-hidden"
    >
      {/* Background Styling - more abstract and futuristic */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900/30 opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
          Michael Simoneau
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-cyan-400 font-semibold mb-2">
          From Enterprise Architecture to The Working Dollar
        </p>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Money is an employee. Put it to work and it pays you $366 for every $1 at the 36,636 cap. Stagnation is a firing offense — idle capital enters early retirement. This is not speculation. This is Metabolic Reality.
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-2xl mx-auto z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <PlaylistAudioPlayer tracks={HERO_TRACKS} />
      </motion.div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ 
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <ChevronDown size={32} className="text-gray-400" />
      </motion.div>

    </section>
  );
}; 