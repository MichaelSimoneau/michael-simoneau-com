#!/usr/bin/env node
/**
 * Post-build script for Expo web export.
 * Applies minimal HTML fixes required by the web app shell.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const htmlPath = resolve('dist', 'index.html');
let html = readFileSync(htmlPath, 'utf-8');

// Fix the Expo default styles that prevent page scrolling
html = html.replace('overflow: hidden;', 'overflow-y: auto; overflow-x: hidden;');
html = html.replace(
  '#root {\n        display: flex;\n        height: 100%;\n        flex: 1;\n      }',
  '#root {\n        min-height: 100%;\n        width: 100%;\n      }'
);

// Make the bundle script a module (some deps use import.meta which requires type="module")
html = html.replace(/<script src="(\/_expo\/[^"]+)" defer><\/script>/g, '<script type="module" src="$1"></script>');

writeFileSync(htmlPath, html);
console.log('[post-build-web] Applied web shell HTML fixes');
