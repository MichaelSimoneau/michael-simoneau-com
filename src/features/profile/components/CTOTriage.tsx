import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp } from 'lucide-react';
import { InteractiveButton } from '../../../ui/buttons/InteractiveButton';

export const CTOTriage: React.FC = () => {
  return (
    <motion.section 
      id="cto-triage"
      className="flex flex-col items-center justify-center text-white px-4 relative py-16 md:py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="container w-full mx-auto px-4"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-16 text-center">
          <span className="block text-cyan-400">Strategic Technology Consulting with Michael Simoneau</span>
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl block mt-4">Enterprise Modernization & Growth</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-6 md:mb-16">
          <motion.div
            className="bg-black/50 p-6 md:p-8 rounded-lg shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
              <Brain className="text-cyan-400 w-8 h-8 md:w-10 md:h-10" />
              Architectural Strategy & Analysis
            </h3>
            <ul className="space-y-3 md:space-y-4 text-base md:text-lg">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>Legacy System Modernization Planning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>Scalable & Resilient Architecture Design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>Cloud Adoption & Migration Strategies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>Technology Roadmap & Value Proposition Alignment</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-black/50 p-6 md:p-8 rounded-lg shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
              <TrendingUp className="text-cyan-400 w-8 h-8 md:w-10 md:h-10" />
              Transformation & Growth Execution
            </h3>
            <ul className="space-y-3 md:space-y-4 text-base md:text-lg">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>Phased Modernization & Implementation Roadmaps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>High-Performance Team Development & Agile Coaching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>DevSecOps & CI/CD Pipeline Implementation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>Future-Proofing Security & Risk Management</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <InteractiveButton
            text="SCHEDULE A STRATEGY SESSION"
            href="mailto:michael.simoneau@brainycouch.com"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};