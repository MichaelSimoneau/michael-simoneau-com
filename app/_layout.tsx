import { useEffect, useLayoutEffect } from 'react';
import { Slot } from 'expo-router';
import { SpeechProvider } from '../src/contexts/SpeechContext';
import { CookieNotice } from '../src/layout/CookieNotice';
import '../src/index.css';

const GA_MEASUREMENT_ID = 'G-58WTRZHT0B';

const TAILWIND_CONFIG = `tailwind.config = {
  theme: {
    extend: {
      animation: {
        'subtle-pulse': 'subtle-pulse 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'subtle-pulse': { '0%, 100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.5, transform: 'scale(0.95)' } },
        'glow': { 'from': { 'text-shadow': '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88' }, 'to': { 'text-shadow': '0 0 20px #00ff88, 0 0 30px #00ff88, 0 0 40px #00ff88' } },
        'float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
      },
      backgroundImage: { 'subtle-grid': 'linear-gradient(to right, rgba(0,255,136,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,136,0.1) 1px, transparent 1px)' },
      backgroundSize: { 'grid-size': '50px 50px' },
    },
  },
}`;

const CUSTOM_CSS = `
html { scroll-behavior: smooth; width: 100%; max-width: 100%; min-height: 100%; margin: 0; padding: 0; overflow-x: hidden; overflow-y: auto; }
body { overscroll-behavior-y: none; min-height: 100%; margin: 0; padding: 0; overflow-x: hidden; overflow-y: hidden !important; width: 100%; max-width: 100%; background: #0B1120; }
#root { min-height: 100% !important; width: 100% !important; height: auto !important; display: block !important; flex: none !important; overflow-x: hidden; }
code.inline-code { background-color: rgba(31,41,55,0.7); color: #67e8f9; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875rem; }
.snap-container { min-height: 100vh; overscroll-behavior-y: none; width: 100%; max-width: 100%; }
.snap-container > section { min-height: 100vh; display: flex; flex-direction: column; position: relative; width: 100%; max-width: 100%; overflow-x: hidden; }
.fixed-size-cta { min-width: 256px !important; max-width: 256px !important; min-height: 48px !important; max-height: 48px !important; }
@media (max-width: 768px) { .fixed-size-cta { min-width: 100% !important; max-width: 100% !important; } .subtle-grid { opacity: 0.4 !important; } }
@keyframes glow-pulse { 0%, 100% { text-shadow: 0 0 10px #22d3ee, 0 0 20px #22d3ee; } 50% { text-shadow: 0 0 20px #22d3ee, 0 0 30px #22d3ee, 0 0 40px #22d3ee; } }
.text-glow { animation: glow-pulse 2s ease-in-out infinite; }
.app-shell {
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.app-main {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}
.app-footer-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.45rem 1rem;
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.7);
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}
.app-footer-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: center;
}
.app-footer-link {
  pointer-events: auto;
  color: inherit;
  text-decoration: none;
}
.app-footer-link:hover,
.app-footer-link:focus-visible {
  text-decoration: underline;
}
`;

/**
 * Injects Tailwind CDN + custom styles into <head> at runtime.
 * The production build gets these via post-build-web.cjs, but the
 * dev server uses Expo's default HTML template so we inject them here.
 */
function useWebStyles() {
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('app-custom-styles')) return;

    const style = document.createElement('style');
    style.id = 'app-custom-styles';
    style.textContent = CUSTOM_CSS;
    document.head.appendChild(style);

    if (!document.getElementById('app-tailwind-config')) {
      const configScript = document.createElement('script');
      configScript.id = 'app-tailwind-config';
      configScript.textContent = TAILWIND_CONFIG;
      document.head.appendChild(configScript);
    }

    if (!document.querySelector('script[src*="tailwindcss"]')) {
      const cdnScript = document.createElement('script');
      cdnScript.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(cdnScript);
    }
  }, []);
}

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
  useWebStyles();
  useGoogleTag();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new Event('prerender-ready'));
    }
  }, []);

  return (
    <SpeechProvider>
      <CookieNotice />
      <div className="app-shell">
        <main className="app-main">
          <Slot />
        </main>
        <CopyrightNotice />
      </div>
    </SpeechProvider>
  );
}
