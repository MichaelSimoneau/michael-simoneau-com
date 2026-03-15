import React from 'react';
import { LegalPageFrame } from '../src/pages/legal/LegalPageFrame';

export default function PrivacyPage() {
  return (
    <LegalPageFrame>
      <main className="mx-auto w-full max-w-4xl px-4 py-16 text-gray-100">
        <h1 className="mb-6 text-3xl font-bold text-cyan-300">Privacy Policy</h1>
        <div className="space-y-4 text-sm leading-7 text-gray-200">
          <p>
            This site collects only standard anonymous statistical usage data required for operating and
            improving site performance.
          </p>
          <p>
            No additional tracking, profiling, sale of personal data, or collection of personal information
            will take place other than information you overtly submit through a form.
          </p>
          <p>
            Form-submitted data is used only for the explicitly requested purpose of that submission.
          </p>
          <p>
            We do not knowingly request sensitive personal data unless clearly stated in the form workflow.
          </p>
        </div>
      </main>
    </LegalPageFrame>
  );
}
