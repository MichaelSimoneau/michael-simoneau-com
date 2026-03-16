#!/usr/bin/env node

import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const DEFAULT_SOURCE_DIR = "public";
const DEFAULT_DEST_DIR = "dist";
const DEFAULT_CACHE_FILE = ".cache/web-static-sync.json";
const DEFAULT_EXCLUDE_DIRS = [];
const DEFAULT_EXCLUDE_FILES = [];

const HELP_TEXT = `Incrementally sync static public assets into dist.

Usage:
  node scripts/sync-static-web.mjs [options]

Options:
  --source-dir <path>         Source directory (default: ${DEFAULT_SOURCE_DIR})
  --dest-dir <path>           Destination directory (default: ${DEFAULT_DEST_DIR})
  --cache-file <path>         Cache file path (default: ${DEFAULT_CACHE_FILE})
  --exclude-dir <name>        Directory name to exclude (repeatable)
  --exclude-file <path>       Relative file path to exclude (repeatable)
  --delete-missing            Delete destination files missing from source
  --help                      Show this help message
`;

const normalizeToPosix = (value) => value.split(path.sep).join(path.posix.sep);

function parseArgs(argv) {
  const options = {
    sourceDir: DEFAULT_SOURCE_DIR,
    destDir: DEFAULT_DEST_DIR,
    cacheFile: DEFAULT_CACHE_FILE,
    excludeDirs: new Set(DEFAULT_EXCLUDE_DIRS),
    excludeFiles: new Set(DEFAULT_EXCLUDE_FILES),
    deleteMissing: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      return { options, shouldShowHelp: true };
    }
    if (token === "--source-dir") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --source-dir");
      options.sourceDir = value;
      index += 1;
      continue;
    }
    if (token === "--dest-dir") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --dest-dir");
      options.destDir = value;
      index += 1;
      continue;
    }
    if (token === "--cache-file") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --cache-file");
      options.cacheFile = value;
      index += 1;
      continue;
    }
    if (token === "--exclude-dir") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --exclude-dir");
      options.excludeDirs.add(value);
      index += 1;
      continue;
    }
    if (token === "--exclude-file") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --exclude-file");
      options.excludeFiles.add(normalizeToPosix(value));
      index += 1;
      continue;
    }
    if (token === "--delete-missing") {
      options.deleteMissing = true;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  return { options, shouldShowHelp: false };
}

function readCache(cachePath) {
  try {
    return JSON.parse(readFileSync(cachePath, "utf8"));
  } catch {
    return { files: {} };
  }
}

function writeCache(cachePath, payload) {
  mkdirSync(path.dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(payload), "utf8");
}

function listFiles(rootDir, { excludeDirs, excludeFiles }) {
  const files = [];

  const visit = (absoluteDir, relativeDir = "") => {
    const entries = readdirSync(absoluteDir).sort((a, b) => a.localeCompare(b));
    for (const entry of entries) {
      const absolutePath = path.join(absoluteDir, entry);
      const relativePath = normalizeToPosix(path.posix.join(relativeDir, entry));
      const stats = statSync(absolutePath);

      if (stats.isDirectory()) {
        if (excludeDirs.has(entry)) {
          continue;
        }
        visit(absolutePath, relativePath);
        continue;
      }

      if (excludeFiles.has(relativePath)) {
        continue;
      }

      files.push({
        relativePath,
        absolutePath,
        size: stats.size,
        mtimeMs: Math.trunc(stats.mtimeMs),
      });
    }
  };

  visit(rootDir);
  return files;
}

function ensureDirectoryForFile(filePath) {
  mkdirSync(path.dirname(filePath), { recursive: true });
}

export function syncStaticWeb({
  sourceDir = DEFAULT_SOURCE_DIR,
  destDir = DEFAULT_DEST_DIR,
  cacheFile = DEFAULT_CACHE_FILE,
  excludeDirs = DEFAULT_EXCLUDE_DIRS,
  excludeFiles = DEFAULT_EXCLUDE_FILES,
  deleteMissing = false,
} = {}) {
  const absoluteSourceDir = path.resolve(process.cwd(), sourceDir);
  const absoluteDestDir = path.resolve(process.cwd(), destDir);
  const absoluteCacheFile = path.resolve(process.cwd(), cacheFile);

  const normalizedExcludeDirs = Array.isArray(excludeDirs) ? excludeDirs : [...excludeDirs];
  const normalizedExcludeFiles = Array.isArray(excludeFiles) ? excludeFiles : [...excludeFiles];

  const nextFiles = listFiles(absoluteSourceDir, {
    excludeDirs: new Set(normalizedExcludeDirs),
    excludeFiles: new Set(normalizedExcludeFiles.map(normalizeToPosix)),
  });

  const previousCache = readCache(absoluteCacheFile);
  const previousFiles = previousCache.files ?? {};
  const nextCache = { files: {} };

  let copied = 0;
  let skipped = 0;

  for (const sourceFile of nextFiles) {
    const previousEntry = previousFiles[sourceFile.relativePath];
    const unchanged =
      previousEntry &&
      previousEntry.size === sourceFile.size &&
      previousEntry.mtimeMs === sourceFile.mtimeMs;

    const targetPath = path.join(absoluteDestDir, sourceFile.relativePath);
    if (unchanged) {
      skipped += 1;
    } else {
      ensureDirectoryForFile(targetPath);
      copyFileSync(sourceFile.absolutePath, targetPath);
      copied += 1;
    }

    nextCache.files[sourceFile.relativePath] = {
      size: sourceFile.size,
      mtimeMs: sourceFile.mtimeMs,
    };
  }

  let deleted = 0;
  if (deleteMissing) {
    const nextSet = new Set(nextFiles.map((file) => file.relativePath));
    for (const relativePath of Object.keys(previousFiles)) {
      if (nextSet.has(relativePath)) {
        continue;
      }
      try {
        unlinkSync(path.join(absoluteDestDir, relativePath));
        deleted += 1;
      } catch {
        // Ignore missing destination files.
      }
    }
  }

  writeCache(absoluteCacheFile, nextCache);

  return {
    sourceDir: absoluteSourceDir,
    destDir: absoluteDestDir,
    total: nextFiles.length,
    copied,
    skipped,
    deleted,
    cacheFile: absoluteCacheFile,
  };
}

export function runCli(argv = process.argv.slice(2)) {
  const { options, shouldShowHelp } = parseArgs(argv);
  if (shouldShowHelp) {
    console.log(HELP_TEXT);
    return 0;
  }

  const result = syncStaticWeb(options);
  console.log(
    `[static-sync] ${result.copied} copied, ${result.skipped} skipped, ${result.deleted} deleted (${result.total} total)`,
  );
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const exitCode = runCli();
    process.exit(exitCode);
  } catch (error) {
    console.error(`[static-sync] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
