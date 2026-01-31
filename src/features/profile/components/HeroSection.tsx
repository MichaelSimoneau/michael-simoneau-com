import React from 'react';
import { motion } from 'framer-motion';
import { AudioPlayer } from '../../../ui/players/AudioPlayer';
import { ChevronDown } from 'lucide-react';



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
          Architecting Resilient Systems, Solving Complex Challenges
        </p>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Leveraging 20+ years of engineering leadership to transform enterprise landscapes and deliver impactful, scalable technology solutions.
        </p>
      </motion.div>

      <div className="w-full max-w-2xl mx-auto z-10 flex flex-col gap-6">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AudioPlayer src="/Zeroth_Protocol_Turns_Data_Into_Organisms.mp3" title="Zeroth Vision" />
        </motion.div>
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <AudioPlayer src="/The_AI_Built_for_Deterministic_Crypto.mp3" title="The AI Built for Deterministic Crypto" />
        </motion.div>
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <AudioPlayer src="/Building_Web_4_With_Money_That_Lives.mp3" title="Building Web4 With Money That Lives" />
        </motion.div>
      </div>

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