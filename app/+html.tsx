import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="color-scheme" content="dark" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    animation: {
                      'subtle-pulse': 'subtle-pulse 2s infinite',
                      'glow': 'glow 2s ease-in-out infinite alternate',
                      'float': 'float 6s ease-in-out infinite',
                    },
                    keyframes: {
                      'subtle-pulse': {
                        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                        '50%': { opacity: 0.5, transform: 'scale(0.95)' },
                      },
                      'glow': {
                        'from': { 'text-shadow': '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88' },
                        'to': { 'text-shadow': '0 0 20px #00ff88, 0 0 30px #00ff88, 0 0 40px #00ff88' },
                      },
                      'float': {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-20px)' },
                      },
                    },
                    backgroundImage: {
                      'subtle-grid': 'linear-gradient(to right, rgba(0,255,136,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,136,0.1) 1px, transparent 1px)',
                    },
                    backgroundSize: {
                      'grid-size': '50px 50px',
                    },
                  },
                },
              }
            `,
          }}
        />
        <script src="https://cdn.tailwindcss.com" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              code.inline-code {
                background-color: rgba(31, 41, 55, 0.7);
                color: #67e8f9;
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 0.875rem;
              }
              *, *::before, *::after { box-sizing: border-box; }
              html {
                scroll-behavior: smooth;
                width: 100%; max-width: 100%; min-height: 100%;
                margin: 0; padding: 0; overflow-x: hidden; overflow-y: auto;
              }
              body {
                overscroll-behavior-y: none; min-height: 100%;
                margin: 0; padding: 0; overflow-x: hidden; width: 100%; max-width: 100%;
                background: #0b1120;
              }
              body::before {
                content: '';
                position: fixed;
                inset: 0;
                z-index: 2147483647;
                pointer-events: none;
                background: #0b1120;
                animation: app-boot-mask-fade 900ms ease 350ms forwards;
              }
              @keyframes app-boot-mask-fade {
                from { opacity: 1; }
                to { opacity: 0; visibility: hidden; }
              }
              #root { width: 100%; max-width: 100%; overflow-x: hidden; }
              .snap-container {
                min-height: 100vh; overscroll-behavior-y: none;
                width: 100%; max-width: 100%;
              }
              .snap-container > section {
                min-height: 100vh; display: flex; flex-direction: column;
                position: relative; width: 100%; max-width: 100%; overflow-x: hidden;
              }
              .fixed-size-cta {
                min-width: 256px !important; max-width: 256px !important;
                min-height: 48px !important; max-height: 48px !important;
              }
              @media (max-width: 768px) {
                .fixed-size-cta { min-width: 100% !important; max-width: 100% !important; }
                .subtle-grid { opacity: 0.4 !important; }
              }
              @keyframes glow-pulse {
                0%, 100% { text-shadow: 0 0 10px #22d3ee, 0 0 20px #22d3ee; }
                50% { text-shadow: 0 0 20px #22d3ee, 0 0 30px #22d3ee, 0 0 40px #22d3ee; }
              }
              .text-glow { animation: glow-pulse 2s ease-in-out infinite; }
              .text-responsive { font-size: 1rem; }
              @media (min-width: 640px) { .text-responsive { font-size: 1.125rem; } }
              @media (min-width: 768px) { .text-responsive { font-size: 1.25rem; } }
              @media (min-width: 1024px) { .text-responsive { font-size: 1.5rem; } }
              .text-responsive-sm { font-size: 0.875rem; }
              @media (min-width: 640px) { .text-responsive-sm { font-size: 1rem; } }
              @media (min-width: 768px) { .text-responsive-sm { font-size: 1.125rem; } }
              @media (min-width: 1024px) { .text-responsive-sm { font-size: 1.25rem; } }
              .text-responsive-lg { font-size: 1.125rem; }
              @media (min-width: 640px) { .text-responsive-lg { font-size: 1.25rem; } }
              @media (min-width: 768px) { .text-responsive-lg { font-size: 1.5rem; } }
              @media (min-width: 1024px) { .text-responsive-lg { font-size: 1.875rem; } }
              .text-responsive-xl { font-size: 1.25rem; }
              @media (min-width: 640px) { .text-responsive-xl { font-size: 1.5rem; } }
              @media (min-width: 768px) { .text-responsive-xl { font-size: 1.875rem; } }
              @media (min-width: 1024px) { .text-responsive-xl { font-size: 2.25rem; } }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
