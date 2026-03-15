#!/usr/bin/env node

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const DEFAULT_PUBLIC_DIR = "public";
const DEFAULT_OUTPUT_FILE = "public/ama-knowledge-index.json";
const DEFAULT_CHUNK_SIZE = 900;
const DEFAULT_CHUNK_OVERLAP = 150;

const HELP_TEXT = `Build AMA knowledge index from public text files.

Usage:
  node scripts/build-ama-knowledge-index.mjs [options]

Options:
  --public-dir <path>    Directory to scan for .txt files (default: ${DEFAULT_PUBLIC_DIR})
  --output-file <path>   Output JSON index file path (default: ${DEFAULT_OUTPUT_FILE})
  --chunk-size <number>  Chunk size in characters (default: ${DEFAULT_CHUNK_SIZE})
  --overlap <number>     Chunk overlap in characters (default: ${DEFAULT_CHUNK_OVERLAP})
  --help                 Show this help message
`;

function parseArgs(argv) {
  const options = {
    publicDir: DEFAULT_PUBLIC_DIR,
    outputFile: DEFAULT_OUTPUT_FILE,
    chunkSize: DEFAULT_CHUNK_SIZE,
    overlap: DEFAULT_CHUNK_OVERLAP,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      return { options, shouldShowHelp: true };
    }
    if (token === "--public-dir") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --public-dir");
      options.publicDir = value;
      index += 1;
      continue;
    }
    if (token === "--output-file") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --output-file");
      options.outputFile = value;
      index += 1;
      continue;
    }
    if (token === "--chunk-size") {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value) || value < 200) {
        throw new Error("Invalid value for --chunk-size. Use a number >= 200.");
      }
      options.chunkSize = Math.trunc(value);
      index += 1;
      continue;
    }
    if (token === "--overlap") {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value) || value < 0) {
        throw new Error("Invalid value for --overlap. Use a number >= 0.");
      }
      options.overlap = Math.trunc(value);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  if (options.overlap >= options.chunkSize) {
    throw new Error("--overlap must be less than --chunk-size");
  }

  return { options, shouldShowHelp: false };
}

function normalizeText(raw) {
  return raw
    .replace(/\r\n/gu, "\n")
    .replace(/\t/gu, " ")
    .replace(/[ ]{2,}/gu, " ")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();
}

function collectTxtFiles(directory, currentRelative = "") {
  const absoluteDir = path.resolve(directory);
  const entries = readdirSync(absoluteDir).sort((a, b) => a.localeCompare(b));
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(absoluteDir, entry);
    const relativePath = path.posix.join(currentRelative, entry);
    const stats = statSync(absolutePath);
    if (stats.isDirectory()) {
      files.push(...collectTxtFiles(absolutePath, relativePath));
      continue;
    }
    if (entry.toLowerCase().endsWith(".txt")) {
      files.push({ absolutePath, publicPath: `/${relativePath.replace(/\\/gu, "/")}` });
    }
  }
  return files;
}

function extractTokens(value) {
  const unique = new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/gu)
      .filter((token) => token.length >= 3),
  );
  return [...unique].slice(0, 120);
}

function chunkText(text, chunkSize, overlap) {
  if (!text) return [];
  const chunks = [];
  let start = 0;
  let chunkIndex = 0;
  while (start < text.length) {
    const hardEnd = Math.min(text.length, start + chunkSize);
    let end = hardEnd;
    if (hardEnd < text.length) {
      const nearestBreak = text.lastIndexOf("\n", hardEnd);
      if (nearestBreak > start + 120) {
        end = nearestBreak;
      }
    }
    const value = text.slice(start, end).trim();
    if (value) {
      chunks.push({
        id: `chunk_${chunkIndex}`,
        text: value,
        tokens: extractTokens(value),
      });
      chunkIndex += 1;
    }
    if (end >= text.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks;
}

export function buildAmaKnowledgeIndex({
  publicDir = DEFAULT_PUBLIC_DIR,
  outputFile = DEFAULT_OUTPUT_FILE,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_CHUNK_OVERLAP,
} = {}) {
  const absolutePublicDir = path.resolve(process.cwd(), publicDir);
  const absoluteOutput = path.resolve(process.cwd(), outputFile);
  const txtFiles = collectTxtFiles(absolutePublicDir);
  if (txtFiles.length === 0) {
    throw new Error(`No .txt files found in ${absolutePublicDir}`);
  }

  const documents = txtFiles.map((file, fileIndex) => {
    const raw = readFileSync(file.absolutePath, "utf8");
    const normalized = normalizeText(raw);
    const chunks = chunkText(normalized, chunkSize, overlap);
    return {
      id: `doc_${fileIndex}`,
      path: file.publicPath,
      charCount: normalized.length,
      chunks,
    };
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    version: 1,
    source: {
      publicDir: `/${path.relative(process.cwd(), absolutePublicDir).replace(/\\/gu, "/")}`,
      totalDocuments: documents.length,
      totalChunks: documents.reduce((sum, doc) => sum + doc.chunks.length, 0),
    },
    documents,
  };

  mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  writeFileSync(absoluteOutput, JSON.stringify(payload), "utf8");

  return {
    outputFile: absoluteOutput,
    totalDocuments: payload.source.totalDocuments,
    totalChunks: payload.source.totalChunks,
  };
}

export function runCli(argv = process.argv.slice(2)) {
  const { options, shouldShowHelp } = parseArgs(argv);
  if (shouldShowHelp) {
    console.log(HELP_TEXT);
    return 0;
  }
  const result = buildAmaKnowledgeIndex(options);
  console.log(
    `[ama-index] Indexed ${result.totalDocuments} documents into ${result.totalChunks} chunks at ${result.outputFile}`,
  );
  return 0;
}

const isCliInvocation =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCliInvocation) {
  try {
    const exitCode = runCli();
    process.exit(exitCode);
  } catch (error) {
    console.error(`[ama-index] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
