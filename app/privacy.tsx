import React from 'react';
import { LegalPageFrame } from '../src/pages/legal/LegalPageFrame';

export default function PrivacyPage() {
  return (
    <LegalPageFrame>
      <main className="mx-auto w-full max-w-4xl px-4 py-16 text-gray-100">
        <h1 className="mb-6 text-3xl font-bold text-cyan-300">Privacy Policy</h1>
        <div className="space-y-4 text-sm leading-7 text-gray-200">
          <p>
            The ONLY tracking used on this website is standard Google Analytics.
          </p>
          <p>
            Standard Google Analytics means anonymous, aggregate usage metrics (for example, page traffic and
            general performance trends) that help operate and improve the site. It does not mean custom user
            profiling or custom identity tracking.
          </p>
          <p>
            No custom tracking, no fingerprinting, no custom user-data recording, and no sale of personal data
            are performed in any way.
          </p>
          <p>
            No personal information is recorded unless you intentionally and explicitly submit it through a
            form, and any form-submitted information is used only for the purpose you requested.
          </p>
          <p>
            Equality is paramount: just as no custom tracking or user data is taken from you, the expectation
            is that no information is taken from this website's data in return beyond the same generic,
            anonymous Google Analytics usage totals required for normal operation.
          </p>
        </div>
      </main>
    </LegalPageFrame>
  );
}
