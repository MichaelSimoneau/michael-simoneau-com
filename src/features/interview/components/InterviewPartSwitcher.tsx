import React from 'react';
import { Link } from 'expo-router';
import { motion } from 'framer-motion';

type InterviewPart = 1 | 2 | 3;

interface InterviewPartSwitcherProps {
  activePart: InterviewPart;
}

const PARTS: Array<{ id: InterviewPart; label: string; href: string }> = [
  { id: 1, label: 'Part 1: The Foundation', href: '/interview/1' },
  { id: 2, label: 'Part 2: From Code to Architecture', href: '/interview/2' },
  { id: 3, label: 'Part 3: Zeroth & the Digital Organism', href: '/interview/3' },
];

export const InterviewPartSwitcher: React.FC<InterviewPartSwitcherProps> = ({ activePart }) => {
  return (
    <nav className="mb-8 w-full" aria-label="Interview sessions">
      <div className="flex w-full max-w-full gap-1 overflow-hidden rounded-full border border-cyan-500/30 bg-gray-900/70 p-1 backdrop-blur-sm">
        {PARTS.map((part) => {
          const isActive = part.id === activePart;

          if (isActive) {
            return (
              <span
                key={part.id}
                className="relative flex min-w-0 flex-1 items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-white"
                aria-current="page"
              >
                <motion.span
                  layoutId="interview-part-switcher-active-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-cyan-500/25 ring-1 ring-cyan-400/40"
                />
                <span className="relative z-10 block w-full truncate text-center">{part.label}</span>
              </span>
            );
          }

          return (
            <Link
              key={part.id}
              href={part.href}
              replace={part.id < activePart}
              className="flex min-w-0 flex-1 items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
            >
              <span className="block w-full truncate text-center">{part.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
