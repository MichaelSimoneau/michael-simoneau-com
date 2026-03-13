import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import type { QAPair } from '../types';

const calculateInterval = (question: string, answer: string) => {
  const answerWords = answer.split(' ').length;
  const questionTypingTime = question.length * 30 * 1.2;
  const answerTypingTime = answer.length * 50 * 1.2;
  const readingTime = answerWords * 250;
  const bufferTime = 2000;
  const totalTime = questionTypingTime + 1500 + answerTypingTime + readingTime + 3000 + bufferTime;
  return Math.max(totalTime, 8000);
};

export interface InterviewButtonProps {
  to: string;
  qaPairs: QAPair[];
  title?: string;
}

export const InterviewButton: React.FC<InterviewButtonProps> = ({ to, qaPairs, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (qaPairs.length === 0) return;
    const currentQuestion = qaPairs[currentIndex].question;
    const currentAnswer = qaPairs[currentIndex].answer;
    const interval = calculateInterval(currentQuestion, currentAnswer);

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % qaPairs.length);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, qaPairs]);

  if (qaPairs.length === 0) return null;

  const currentQuestion = qaPairs[currentIndex].question;
  const currentAnswer = qaPairs[currentIndex].answer;

  return (
    <div className="w-full h-full">
      <Link href={to} className="block w-full">
        <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-lg w-full h-full overflow-hidden transform hover:scale-[0.98] transition-transform duration-300">
          <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
          <div className="relative z-10 flex h-full flex-col p-4 space-y-2">
            {title && (
              <div className="text-cyan-400/90 font-semibold text-xs uppercase tracking-wide mb-1 shrink-0">
                {title}
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-white space-y-3 leading-relaxed break-words"
                >
                  <div>
                    <span className="text-cyan-400 font-bold text-sm mr-2">Q:</span>
                    <span className="text-gray-100 text-sm font-medium">
                      <Typewriter
                        words={[currentQuestion]}
                        cursor={false}
                        typeSpeed={30}
                        delaySpeed={1500}
                      />
                    </span>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold text-sm mr-2">A:</span>
                    <span className="text-gray-300 text-sm">
                      <Typewriter
                        words={[currentAnswer]}
                        cursor={false}
                        typeSpeed={50}
                        delaySpeed={4000}
                      />
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="text-cyan-400/80 text-xs font-medium tracking-wide flex items-center shrink-0">
              Read Full Interview
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block ml-1"
              >
                →
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
