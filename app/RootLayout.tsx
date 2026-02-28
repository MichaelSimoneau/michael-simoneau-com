import { useEffect, useLayoutEffect } from 'react';
import { Slot } from 'expo-router';
import { SpeechProvider } from '../src/contexts/SpeechContext';
import { CookieNotice } from '../src/layout/CookieNotice';

const GA_MEASUREMENT_ID = 'G-58WTRZHT0B';

function useGoogleTag() {
  useLayoutEffect(() => {
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
      className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none flex justify-center py-2 px-4 bg-black/70 backdrop-blur-[2px]"
      aria-label="Copyright"
    >
      <p
        className="text-xs text-white/90 text-center"
        style={{ textShadow: '0 0 8px #22d3ee, 0 0 12px rgba(34,211,238,0.4)' }}
      >
        © 2026{' '}
        <a
          href="https://MichaelSimoneau.com"
          className="pointer-events-auto hover:underline focus:outline-none focus:underline"
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
      <CookieNotice />
      <CopyrightNotice />
      <Slot />
    </SpeechProvider>
  );
}
