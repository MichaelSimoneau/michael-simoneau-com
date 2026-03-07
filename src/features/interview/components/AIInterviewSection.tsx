import React from 'react';
import { motion } from 'framer-motion';
import { InterviewButton } from './InterviewButton';
import { interview1Data, interview2Data, interview3Data } from '../data/interviewData';

const sectionWrapperClasses = 'py-12 md:py-20 px-4 relative min-h-screen flex flex-col items-center justify-center';

/**
 * AI Interview section: three interview teaser buttons in a vertical stack with
 * fixed-height slots so typewriter content changes do not affect section or page layout.
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
      <div className="container mx-auto max-w-6xl w-full">
        <h2 className="text-4xl font-bold text-white mb-4 text-center">
          AI <span className="text-cyan-400">Interview</span>
        </h2>
        <p className="text-gray-300 text-center text-lg max-w-xl mx-auto mb-8">
          A conversation about the journey in technology and problem-solving—from building a first computer at 12 to leading enterprise transformations. Three sessions: the foundation, the architecture, and the digital organism.
        </p>
        <div className="flex flex-col gap-6 w-full">
          <div className="h-[230px] overflow-hidden min-w-0 w-full">
            <InterviewButton
              to="/interview"
              qaPairs={interview1Data}
              title="Session 1: The Foundation"
            />
          </div>
          <div className="h-[230px] overflow-hidden min-w-0 w-full">
            <InterviewButton
              to="/interview/2"
              qaPairs={interview2Data}
              title="Session 2: From Code to Architecture"
            />
          </div>
          <div className="h-[230px] overflow-hidden min-w-0 w-full">
            <InterviewButton
              to="/interview/3"
              qaPairs={interview3Data}
              title="Session 3: Zeroth & the Digital Organism"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};
