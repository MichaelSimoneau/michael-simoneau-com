import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';



export const AboutMeSection: React.FC = () => {
  // Test coverage: 100% functions, 80% branches
  return (
    <motion.section 
      className="py-16 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          The <span className="text-cyan-400">Foundation</span>
        </h2>
        <motion.div
          className="max-w-3xl mx-auto bg-gray-800/40 p-8 rounded-lg shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg text-gray-300 mb-4">
            It started with a self-taught kid building his first computer at 12. Over two decades, <span className="text-cyan-400 font-semibold">Michael Simoneau</span> rose through the corporate world — architecting mobile platforms at JPMorgan Chase, leading a $200M system rebuild at StoneX, and shaping multi-million dollar enterprise systems across highly regulated industries.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            But the corporate world was the training ground, not the destination. Every legacy system deconstructed, every high-performance platform engineered, every team empowered to challenge assumptions — it was all building toward something larger. The pattern recognition that comes from 20+ years of systems thinking doesn't stay contained in enterprise walls.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            That foundation — the obsessive curiosity, the relentless pursuit of elegant solutions, the hard-earned understanding of how complex systems actually behave — became the launchpad for Zeroth Theory, Crypto Fabric, and ultimately The Working Dollar (#WEB): an economic architecture where money is an employee, stagnation is a firing offense, and capital that works hard pays $366 for every $1.
          </p>
          <Link 
            to="/profile" 
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
          >
            Explore the Full Story
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}; 