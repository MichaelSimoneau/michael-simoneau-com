import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cookieService } from '../src/services/cookieService';
import { LegalPageFrame } from '../src/pages/legal/LegalPageFrame';

const MAIN_SCROLL_CONTAINER_ID = 'new-main-page-scroll-container';

export default function TermsPage() {
  const [celebrationAcceptCount, setCelebrationAcceptCount] = useState<number | null>(null);
  const confettiPieces = useMemo(() => Array.from({ length: 28 }, (_, index) => index), []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let hasMarkedReward = false;
    const markRewardIfEligible = () => {
      if (hasMarkedReward) {
        return;
      }
      if (!cookieService.hasSeenMediaTermsPrompt()) {
        return;
      }
      const scrollContainer = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
      const scrollBottom = scrollContainer
        ? scrollContainer.scrollTop + scrollContainer.clientHeight
        : window.scrollY + window.innerHeight;
      const scrollHeight = scrollContainer?.scrollHeight ?? document.documentElement.scrollHeight;
      const threshold = Math.max(0, scrollHeight - 12);
      if (scrollBottom >= threshold) {
        const preReadAcceptCount = cookieService.getPreReadAcceptCount();
        cookieService.setMediaTermsRewardEligibility(true);
        cookieService.setMediaTermsAgreement(true);
        setCelebrationAcceptCount(preReadAcceptCount);
        hasMarkedReward = true;
      }
    };

    markRewardIfEligible();
    const scrollContainer = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', markRewardIfEligible, { passive: true });
    } else {
      window.addEventListener('scroll', markRewardIfEligible, { passive: true });
    }
    window.addEventListener('resize', markRewardIfEligible);
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', markRewardIfEligible);
      } else {
        window.removeEventListener('scroll', markRewardIfEligible);
      }
      window.removeEventListener('resize', markRewardIfEligible);
    };
  }, []);

  return (
    <LegalPageFrame>
      <main className="mx-auto w-full max-w-4xl px-4 py-16 text-gray-100">
        <h1 className="mb-6 text-3xl font-bold text-cyan-300">Terms and Confidentiality Agreement</h1>
        <div className="space-y-4 text-sm leading-7 text-gray-200">
          <p>
            By accessing media on this site, you agree that all proprietary ideas, demonstrations, and
            materials are confidential. What you see and hear here stays here.
          </p>
          <p>
            You may not copy, redistribute, re-publish, screen record, summarize for public posting, or
            disclose any confidential material to third parties without explicit written permission.
          </p>
          <p>
            Access is provided for private review only. No license, transfer of ownership, or waiver of
            intellectual property rights is granted by viewing this content.
          </p>
          <p>
            If you do not agree with these confidentiality requirements, do not proceed with playback or
            access protected media.
          </p>
          <p>
            This agreement is designed to be seamless for legitimate viewers while preserving strict
            confidentiality protections for sensitive and proprietary concepts.
          </p>
        </div>
      </main>

      <AnimatePresence>
        {celebrationAcceptCount !== null && (
          <motion.div
            className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/65 backdrop-blur-[2px] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-cyan-300/60 bg-gradient-to-br from-cyan-500/35 via-emerald-500/25 to-blue-900/50 p-8 text-white shadow-[0_0_90px_rgba(34,211,238,0.45)]"
              initial={{ scale: 0.78, y: 60, rotate: -1 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 230, damping: 20 }}
            >
              <div className="pointer-events-none absolute inset-0">
                {confettiPieces.map((piece) => (
                  <motion.span
                    key={piece}
                    className="absolute h-2 w-2 rounded-full"
                    style={{
                      left: `${(piece * 17) % 100}%`,
                      top: '-8%',
                      backgroundColor: piece % 3 === 0 ? '#22d3ee' : piece % 3 === 1 ? '#34d399' : '#facc15',
                    }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: ['0vh', '110vh'], opacity: [0, 1, 1, 0], rotate: [0, 240, 480] }}
                    transition={{ duration: 2.6 + (piece % 5) * 0.22, repeat: Infinity, delay: piece * 0.05 }}
                  />
                ))}
              </div>

              <motion.h2
                className="relative z-10 text-3xl sm:text-5xl font-black text-center tracking-tight"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                THANK YOU FOR ACTUALLY READING THE TERMS
              </motion.h2>
              <motion.p
                className="relative z-10 mt-4 text-center text-base sm:text-lg text-cyan-100"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Genuine respect. You took the time to reach the end.
              </motion.p>
              {celebrationAcceptCount > 0 && (
                <motion.p
                  className="relative z-10 mt-4 text-center text-sm sm:text-base font-semibold text-amber-200"
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  You clicked “Agree &amp; Resume” {celebrationAcceptCount} time
                  {celebrationAcceptCount === 1 ? '' : 's'} before reaching the end.
                </motion.p>
              )}
              <motion.div
                className="relative z-10 mt-8 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  type="button"
                  className="rounded-lg bg-white/90 px-6 py-3 text-sm font-bold text-black hover:bg-white"
                  onClick={() => setCelebrationAcceptCount(null)}
                >
                  Continue
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LegalPageFrame>
  );
}
