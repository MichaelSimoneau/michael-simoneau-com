import { useEffect, useLayoutEffect } from 'react';
import { Slot } from 'expo-router';
import { SpeechProvider } from '../src/contexts/SpeechContext';
import { CookieNotice } from '../src/layout/CookieNotice';

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
body { overscroll-behavior-y: none; min-height: 100%; margin: 0; padding: 0; overflow-x: hidden; overflow-y: auto !important; width: 100%; max-width: 100%; background: #0B1120; }
#root { min-height: 100% !important; width: 100% !important; height: auto !important; display: block !important; flex: none !important; overflow-x: hidden; }
code.inline-code { background-color: rgba(31,41,55,0.7); color: #67e8f9; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875rem; }
.snap-container { min-height: 100vh; overscroll-behavior-y: none; width: 100%; max-width: 100%; }
.snap-container > section { min-height: 100vh; display: flex; flex-direction: column; position: relative; width: 100%; max-width: 100%; overflow-x: hidden; }
.fixed-size-cta { min-width: 256px !important; max-width: 256px !important; min-height: 48px !important; max-height: 48px !important; }
@media (max-width: 768px) { .fixed-size-cta { min-width: 100% !important; max-width: 100% !important; } .subtle-grid { opacity: 0.4 !important; } }
@keyframes glow-pulse { 0%, 100% { text-shadow: 0 0 10px #22d3ee, 0 0 20px #22d3ee; } 50% { text-shadow: 0 0 20px #22d3ee, 0 0 30px #22d3ee, 0 0 40px #22d3ee; } }
.text-glow { animation: glow-pulse 2s ease-in-out infinite; }
`;

/**
 * Injects Tailwind CDN + custom styles into <head> at runtime.
 * The production build gets these via post-build-web.mjs, but the
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

    if (!document.querySelector('script[src*="tailwindcss"]')) {
      const cdnScript = document.createElement('script');
      cdnScript.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(cdnScript);
      cdnScript.onload = () => {
        const configScript = document.createElement('script');
        configScript.textContent = TAILWIND_CONFIG;
        document.head.appendChild(configScript);
      };
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
  useWebStyles();

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
