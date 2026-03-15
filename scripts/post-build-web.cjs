#!/usr/bin/env node
/**
 * Post-build script for Expo web export.
 * Patches all exported HTML files so static prerendered routes
 * get the same runtime compatibility tweaks.
 */
const { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } = require('fs');
const { dirname, resolve } = require('path');

const distDir = resolve('dist');
const cacheFile = resolve('.cache/post-build-web-cache.json');
const cacheVersion = 1;

function collectHtmlFiles(directory) {
  const entries = readdirSync(directory);
  const htmlFiles = [];

  for (const entry of entries) {
    const absolutePath = resolve(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      htmlFiles.push(...collectHtmlFiles(absolutePath));
      continue;
    }

    if (entry.endsWith('.html')) {
      htmlFiles.push({
        absolutePath,
        size: stats.size,
        mtimeMs: Math.trunc(stats.mtimeMs),
      });
    }
  }

  return htmlFiles;
}

function readCache(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return { version: cacheVersion, files: {} };
  }
}

function writeCache(filePath, payload) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(payload), 'utf-8');
}

function patchHtml(html) {
  let patchedHtml = html;

  // Fix Expo default styles that can lock document scrolling.
  patchedHtml = patchedHtml.replace(/overflow:\s*hidden;/g, 'overflow-y: auto; overflow-x: hidden;');
  patchedHtml = patchedHtml.replace(
    '#root {\n        display: flex;\n        height: 100%;\n        flex: 1;\n      }',
    '#root {\n        min-height: 100%;\n        width: 100%;\n      }'
  );

  // Some dependencies expect import.meta, so Expo bundle scripts must be modules.
  patchedHtml = patchedHtml.replace(
    /<script src="(\/_expo\/[^"]+)" defer><\/script>/g,
    '<script type="module" src="$1"></script>'
  );

  const injections = `
    <meta name="color-scheme" content="dark" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      window.tailwind = window.tailwind || {};
      window.tailwind.config = {
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
    </script>
    <style>
      code.inline-code {
        background-color: rgba(31, 41, 55, 0.7);
        color: #67e8f9;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.875rem;
      }
      html {
        scroll-behavior: smooth;
        width: 100%; max-width: 100%; min-height: 100%;
        margin: 0; padding: 0; overflow-x: hidden; overflow-y: auto;
      }
      body {
        overscroll-behavior-y: none; min-height: 100%;
        margin: 0; padding: 0; overflow-x: hidden; width: 100%; max-width: 100%;
        background: #0B1120;
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
    </style>
`;

  const hasTailwindCdn = patchedHtml.includes('https://cdn.tailwindcss.com');
  const hasCustomStyles = patchedHtml.includes('code.inline-code');

  if (!hasTailwindCdn || !hasCustomStyles) {
    patchedHtml = patchedHtml.replace('</head>', injections + '\n  </head>');
  }

  return patchedHtml;
}

const htmlFiles = collectHtmlFiles(distDir);
const previousCache = readCache(cacheFile);
const nextCache = {
  version: cacheVersion,
  files: {},
};
let patchedCount = 0;
let skippedUnchangedCount = 0;

for (const htmlFile of htmlFiles) {
  const htmlPath = htmlFile.absolutePath;
  const signature = `${htmlFile.size}:${htmlFile.mtimeMs}`;
  const previousEntry = previousCache.files?.[htmlPath];
  if (previousEntry?.signature === signature && previousEntry.cacheVersion === cacheVersion) {
    skippedUnchangedCount += 1;
    nextCache.files[htmlPath] = previousEntry;
    continue;
  }

  const html = readFileSync(htmlPath, 'utf-8');
  const patched = patchHtml(html);

  if (patched !== html) {
    writeFileSync(htmlPath, patched);
    patchedCount += 1;
    const updatedStats = statSync(htmlPath);
    nextCache.files[htmlPath] = {
      signature: `${updatedStats.size}:${Math.trunc(updatedStats.mtimeMs)}`,
      cacheVersion,
    };
    continue;
  }

  nextCache.files[htmlPath] = {
    signature,
    cacheVersion,
  };
}

writeCache(cacheFile, nextCache);
console.log(
  `[post-build-web] Patched ${patchedCount} of ${htmlFiles.length} HTML files in dist/ (${skippedUnchangedCount} unchanged skipped)`,
);
