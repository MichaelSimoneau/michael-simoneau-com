/**
 * Post-build prerender script.
 *
 * After `vite build` produces the SPA in dist/, this script:
 * 1. Starts a local static HTTP server from dist/
 * 2. Launches Puppeteer and visits each route
 * 3. Waits for the "prerender-ready" event (dispatched by App.tsx)
 * 4. Captures the fully-rendered HTML (with correct meta tags from the Seo component)
 * 5. Writes each route's HTML to dist/<route>/index.html
 *
 * Usage: npx tsx scripts/prerender.ts
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { prerenderRoutes } from './prerender-routes';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const PORT = 4173;

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.mp3':  'audio/mpeg',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.txt':  'text/plain',
};

/**
 * Minimal static file server that falls back to index.html for SPA routing.
 */
function startServer(): Promise<ReturnType<typeof createServer>> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST_DIR, req.url || '/');

      if (!existsSync(filePath) || filePath.endsWith('/')) {
        const withIndex = join(filePath, 'index.html');
        if (existsSync(withIndex)) {
          filePath = withIndex;
        } else {
          filePath = join(DIST_DIR, 'index.html');
        }
      }

      const ext = extname(filePath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      try {
        const content = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    server.listen(PORT, () => {
      console.log(`[prerender] Static server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerender() {
  console.log(`[prerender] Starting prerender for ${prerenderRoutes.length} routes...`);

  const server = await startServer();
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  const MAX_CONCURRENT = 4;
  let completed = 0;

  async function renderRoute(route: string) {
    const page = await browser.newPage();
    const url = `http://localhost:${PORT}${route}`;

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          if (document.querySelector('title')?.textContent !== 'Loading Application...') {
            resolve();
            return;
          }
          document.addEventListener('prerender-ready', () => resolve(), { once: true });
          setTimeout(() => resolve(), 5000);
        });
      });

      await new Promise(r => setTimeout(r, 500));

      const html = await page.content();

      const outputDir = route === '/'
        ? DIST_DIR
        : join(DIST_DIR, ...route.split('/').filter(Boolean));

      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = join(outputDir, 'index.html');
      writeFileSync(outputPath, html, 'utf-8');

      completed++;
      console.log(`[prerender] (${completed}/${prerenderRoutes.length}) ${route} -> ${outputPath.replace(DIST_DIR, 'dist')}`);
    } catch (err) {
      console.error(`[prerender] Failed to render ${route}:`, err);
    } finally {
      await page.close();
    }
  }

  for (let i = 0; i < prerenderRoutes.length; i += MAX_CONCURRENT) {
    const batch = prerenderRoutes.slice(i, i + MAX_CONCURRENT);
    await Promise.all(batch.map(renderRoute));
  }

  await browser.close();
  server.close();

  console.log(`[prerender] Done. ${completed}/${prerenderRoutes.length} routes prerendered.`);
}

prerender().catch((err) => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
