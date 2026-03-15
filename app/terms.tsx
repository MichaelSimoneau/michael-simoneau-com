import React, { useEffect } from 'react';
import { cookieService } from '../src/services/cookieService';

export default function TermsPage() {
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
      const doc = document.documentElement;
      const scrollBottom = window.scrollY + window.innerHeight;
      const threshold = Math.max(0, doc.scrollHeight - 12);
      if (scrollBottom >= threshold) {
        cookieService.setMediaTermsRewardEligibility(true);
        hasMarkedReward = true;
      }
    };

    markRewardIfEligible();
    window.addEventListener('scroll', markRewardIfEligible, { passive: true });
    window.addEventListener('resize', markRewardIfEligible);
    return () => {
      window.removeEventListener('scroll', markRewardIfEligible);
      window.removeEventListener('resize', markRewardIfEligible);
    };
  }, []);

  return (
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
  );
}
