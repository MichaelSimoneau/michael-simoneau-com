import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { SpeechProvider } from '../src/contexts/SpeechContext';
import { CookieNotice } from '../src/layout/CookieNotice';

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
  useEffect(() => {
    document.dispatchEvent(new Event('prerender-ready'));
  }, []);

  return (
    <SpeechProvider>
      <CookieNotice />
      <CopyrightNotice />
      <Slot />
    </SpeechProvider>
  );
}
