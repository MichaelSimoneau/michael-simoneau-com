import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { SpeechProvider } from '../src/contexts/SpeechContext';
import { ScrollProvider } from '../src/contexts/ScrollContext';
import { CookieNotice } from '../src/layout/CookieNotice';
import { ProfileFlowProvider } from '../src/features/profile/flow';
import '../src/index.css';

const GA_MEASUREMENT_ID = 'G-58WTRZHT0B';

function useGoogleTag() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!document.querySelector(`script[src*="gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
      const gtagSrcScript = document.createElement('script');
      gtagSrcScript.async = true;
      gtagSrcScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.insertBefore(gtagSrcScript, document.head.firstChild);
    }

    if (!document.getElementById('app-gtag-config')) {
      const gtagConfigScript = document.createElement('script');
      gtagConfigScript.id = 'app-gtag-config';
      gtagConfigScript.textContent = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`;
      document.head.insertBefore(gtagConfigScript, document.head.firstChild);
    }
  }, []);
}

function CopyrightNotice() {
  return (
    <footer
      className="app-footer-bar"
      aria-label="Copyright"
    >
      <p className="app-footer-content">
        © 2026{' '}
        <a
          href="https://MichaelSimoneau.com"
          className="app-footer-link"
          rel="noopener noreferrer"
        >
          Michael Simoneau
        </a>
      </p>
    </footer>
  );
}

export default function RootLayout() {
  useGoogleTag();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new Event('prerender-ready'));
    }
  }, []);

  return (
    <SpeechProvider>
      <ScrollProvider>
        <ProfileFlowProvider>
          <CookieNotice />
          <div className="app-shell">
            <main className="app-main">
              <Slot />
            </main>
            <CopyrightNotice />
          </div>
        </ProfileFlowProvider>
      </ScrollProvider>
    </SpeechProvider>
  );
}
