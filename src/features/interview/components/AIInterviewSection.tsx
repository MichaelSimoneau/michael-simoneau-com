import React from 'react';
import { motion } from 'framer-motion';
import { InterviewButton } from './InterviewButton';

const sectionWrapperClasses = 'py-12 md:py-20 px-4 relative min-h-screen';

/**
 * AI Interview section: fixed-height slot for InterviewButton so typewriter
 * content changes do not affect section or page layout.
 */
export const AIInterviewSection: React.FC = () => {
  return (
    <motion.section
      id="ai-interview"
      className={`${sectionWrapperClasses} bg-gray-900/40`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-4xl font-bold text-white mb-4 text-center">
          AI <span className="text-cyan-400">Interview</span>
        </h2>
        <p className="text-gray-300 text-center text-lg max-w-xl mx-auto mb-8">
          A conversation about the journey in technology and problem-solving - from building a first computer at 12 to leading enterprise transformations. The full interview explores teaching how to learn, continuous learning, and turning challenges into opportunities.
        </p>
        <div className="h-[160px] overflow-hidden">
          <InterviewButton />
        </div>
      </div>
    </motion.section>
  );
};
