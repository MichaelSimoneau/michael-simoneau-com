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
        <h1 className="mb-6 text-3xl font-bold text-cyan-300">Binding Terms and Confidentiality Agreement</h1>
        <div className="space-y-4 text-sm leading-7 text-gray-200">
          <p>
            This site and all related audio, video, text, code, datasets, concepts, demonstrations, interface
            behavior, prompts, outputs, and associated materials (collectively, the "Protected Information")
            are the personal intellectual property and confidential information of Michael Simoneau.
          </p>
          <p>
            By accessing, viewing, listening to, or otherwise interacting with this site, you enter into a
            legally binding confidentiality agreement with Michael Simoneau and agree to keep all Protected
            Information strictly confidential.
          </p>
          <p>
            You receive no license or other right, express or implied, by estoppel or otherwise, to use,
            reproduce, modify, adapt, distribute, display, perform, publish, transmit, disclose, train any
            model on, reverse engineer, scrape, extract, commercialize, or create derivative works from any
            Protected Information.
          </p>
          <p>
            You must not record, screenshot, screen-capture, copy, summarize for public posting, share with
            third parties, or otherwise disseminate any Protected Information in whole or in part without prior
            written authorization signed by Michael Simoneau.
          </p>
          <p>
            All rights, title, and interest in and to the Protected Information are and remain exclusively with
            Michael Simoneau. No ownership rights are transferred. No waiver of rights is valid unless in a
            written instrument signed by Michael Simoneau.
          </p>
          <p>
            You acknowledge and agree that unauthorized use or disclosure of Protected Information will cause
            immediate and irreparable harm for which monetary damages may be insufficient. Michael Simoneau is
            entitled to injunctive and equitable relief, in addition to all other remedies available at law or
            in equity, without posting bond where permitted by law.
          </p>
          <p>
            This agreement is governed by the laws of the State of California, without regard to conflict of
            law principles. Any dispute arising out of or related to this agreement or your access to this site
            shall be brought exclusively in the state or federal courts located in California, and you consent
            to personal jurisdiction and venue in those courts.
          </p>
          <p>
            If any provision of this agreement is held unenforceable, the remaining provisions remain in full
            force and effect. This agreement constitutes the entire agreement regarding confidentiality and use
            of Protected Information available on this site.
          </p>
          <p>
            If you do not agree to every term above, you must immediately stop using this site and must not
            access any protected content.
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
