import { lazy, Suspense, useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { SpeechProvider } from '../src/contexts/SpeechContext';
import { ScrollProvider } from '../src/contexts/ScrollContext';
import { CookieNotice } from '../src/layout/CookieNotice';
import { ProfileFlowProvider } from '../src/features/profile/flow';
import { BeforeAndAfterProvider } from '../src/hooks/useBeforeAndAfter';
import { useErrorContextCapture } from '../src/features/ama/hooks';
import { CaptionsViewportProvider } from '../src/ui/players/CaptionsViewportProvider';
import '../src/index.css';

const GA_MEASUREMENT_ID = 'G-58WTRZHT0B';
const AmaLauncher = lazy(() =>
  import('../src/features/ama/components/AmaLauncher').then((module) => ({ default: module.AmaLauncher })),
);
const CaptionsViewportOverlay = lazy(() =>
  import('../src/ui/players/CaptionsViewportOverlay').then((module) => ({
    default: module.CaptionsViewportOverlay,
  })),
);

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
        <a href="/terms" className="app-footer-link">
          Terms
        </a>
        <span>|</span>
        © 2026{' '}
        <a
          href="https://MichaelSimoneau.com"
          className="app-footer-link"
          rel="noopener noreferrer"
        >
          Michael Simoneau
        </a>
        <span>|</span>
        <a href="/privacy" className="app-footer-link">
          Privacy
        </a>
      </p>
    </footer>
  );
}

export default function RootLayout() {
  useGoogleTag();
  useErrorContextCapture();
  const [shouldMountDeferredUi, setShouldMountDeferredUi] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new Event('prerender-ready'));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const idleCallback = window.requestIdleCallback?.(() => {
      setShouldMountDeferredUi(true);
    });
    const timeoutId = window.setTimeout(() => {
      setShouldMountDeferredUi(true);
    }, 120);

    return () => {
      if (typeof idleCallback === 'number' && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleCallback);
      }
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <SpeechProvider>
      <ScrollProvider>
        <ProfileFlowProvider>
          <BeforeAndAfterProvider>
            <CaptionsViewportProvider>
              <CookieNotice />
              {shouldMountDeferredUi ? (
                <Suspense fallback={null}>
                  <AmaLauncher />
                </Suspense>
              ) : null}
              <div className="app-shell">
                <main className="app-main">
                  <Slot />
                </main>
                <CopyrightNotice />
              </div>
              {shouldMountDeferredUi ? (
                <Suspense fallback={null}>
                  <CaptionsViewportOverlay />
                </Suspense>
              ) : null}
            </CaptionsViewportProvider>
          </BeforeAndAfterProvider>
        </ProfileFlowProvider>
      </ScrollProvider>
    </SpeechProvider>
  );
}
