import { useEffect } from "react";
import { SpeechProvider } from "./contexts/SpeechContext";
import { CookieNotice } from "./layout/CookieNotice";
import { Outlet, ScrollRestoration } from "react-router-dom";

/**
 * Root-level copyright bar. Fixed at bottom with z-index above CookieNotice
 * so it is never obstructed. Low-profile, white text with site accent shadow.
 */
function CopyrightNotice() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none flex justify-center py-2 px-4 bg-black/70 backdrop-blur-[2px]"
      aria-label="Copyright"
    >
      <p className="text-xs text-white/90 text-center" style={{ textShadow: "0 0 8px #22d3ee, 0 0 12px rgba(34,211,238,0.4)" }}>
        © 2026{" "}
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

function App() {
  useEffect(() => {
    document.dispatchEvent(new Event('prerender-ready'));
  }, []);

  return (
    <SpeechProvider>
      <CookieNotice />
      <CopyrightNotice />
      <ScrollRestoration />
      <Outlet />
    </SpeechProvider>
  );
}

export default App;
