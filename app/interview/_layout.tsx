import { useEffect, useRef } from 'react';
import { Link, Slot, usePathname } from 'expo-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { MainNav } from '../../src/layout/MainNav';
import { AnimatedBackground } from '../../src/backgrounds/AnimatedBackground';
import { InterviewPartSwitcher } from '../../src/features/interview/components/InterviewPartSwitcher';

type InterviewPart = 1 | 2 | 3;

const getPartFromPathname = (pathname: string): InterviewPart | undefined => {
  if (pathname.startsWith('/interview/1') || pathname === '/interview') return 1;
  if (pathname.startsWith('/interview/2')) return 2;
  if (pathname.startsWith('/interview/3')) return 3;
  return undefined;
};

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 72 : -72,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -72 : 72,
    opacity: 0,
  }),
};

export default function InterviewLayout() {
  const pathname = usePathname();
  const currentPart = getPartFromPathname(pathname);
  const previousPartRef = useRef<InterviewPart | undefined>(undefined);

  const previousPart = previousPartRef.current;
  const hasDirectionalTransition =
    previousPart !== undefined && currentPart !== undefined && previousPart !== currentPart;
  const direction = hasDirectionalTransition ? (currentPart > previousPart ? 1 : -1) : 0;

  useEffect(() => {
    previousPartRef.current = currentPart;
  }, [currentPart, pathname]);

  return (
    <>
      <AnimatedBackground />
      <MainNav />
      <div className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10">
        <section className="min-h-screen text-white py-20 px-4 pt-24">
          <div className="container mx-auto max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center text-cyan-400 mb-8 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>

            <InterviewPartSwitcher activePart={currentPart ?? 1} />

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={pathname}
                custom={direction}
                variants={contentVariants}
                initial={hasDirectionalTransition ? 'enter' : false}
                animate="center"
                exit={hasDirectionalTransition ? 'exit' : undefined}
                transition={{
                  x: { duration: 1, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 1, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <Slot />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </>
  );
}
