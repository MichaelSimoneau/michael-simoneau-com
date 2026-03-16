#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const DEFAULT_PUBLIC_DIR = "public";
const DEFAULT_DOCS_DIR = "docs";
const DEFAULT_OUTPUT_FILE = "public/ama-knowledge-index.json";
const DEFAULT_CHUNK_SIZE = 900;
const DEFAULT_CHUNK_OVERLAP = 150;
const DEFAULT_ENRICHMENT_CACHE_FILE = ".cache/ama-enrichment-cache.json";
const DEFAULT_ENRICHMENT_MODEL = "gemini-3.1-pro-preview";
const DEFAULT_ENRICHMENT_MAX_CHUNKS = 120;
const DEFAULT_ALLOWED_EXTENSIONS = [".txt", ".md", ".mdx", ".csv", ".json", ".yaml", ".yml"];
const DEFAULT_PUBLIC_EXTENSIONS = [".txt"];
const EXCLUDED_EXTENSIONS = new Set([".pdf"]);
const DEFAULT_MAX_FILE_BYTES = 8 * 1024 * 1024;
const DEFAULT_MAX_TOTAL_CHUNKS = 2000;

const HELP_TEXT = `Build AMA knowledge index from configured corpus directories.

Usage:
  node scripts/build-ama-knowledge-index.mjs [options]

Options:
  --public-dir <path>    Public corpus directory (default: ${DEFAULT_PUBLIC_DIR})
  --docs-dir <path>      Docs corpus directory or "none" to disable (default: ${DEFAULT_DOCS_DIR})
  --extensions <csv>     Allowed docs text extensions (default: ${DEFAULT_ALLOWED_EXTENSIONS.join(",")})
  --max-file-bytes <n>   Skip corpus files larger than this size (default: ${DEFAULT_MAX_FILE_BYTES})
  --max-total-chunks <n> Limit total chunks written to the index (default: ${DEFAULT_MAX_TOTAL_CHUNKS})
  --output-file <path>   Output JSON index file path (default: ${DEFAULT_OUTPUT_FILE})
  --chunk-size <number>  Chunk size in characters (default: ${DEFAULT_CHUNK_SIZE})
  --overlap <number>     Chunk overlap in characters (default: ${DEFAULT_CHUNK_OVERLAP})
  --enrich-ai            Enable Gemini AI enrichment for chunks
  --no-enrich-ai         Disable Gemini AI enrichment for chunks
  --enrichment-model     Gemini model for enrichment (default: ${DEFAULT_ENRICHMENT_MODEL})
  --cache-file <path>    Enrichment cache file (default: ${DEFAULT_ENRICHMENT_CACHE_FILE})
  --enrich-max-chunks    Max new chunk enrichments per run (default: ${DEFAULT_ENRICHMENT_MAX_CHUNKS})
  --help                 Show this help message
`;

function parseArgs(argv) {
  const envEnrichFlag = process.env.AMA_ENRICH_AI;
  const envEnrichByDefault =
    typeof envEnrichFlag === "string" ? envEnrichFlag.toLowerCase() === "true" : false;
  const options = {
    publicDir: DEFAULT_PUBLIC_DIR,
    docsDir: DEFAULT_DOCS_DIR,
    allowedExtensions: [...DEFAULT_ALLOWED_EXTENSIONS],
    maxFileBytes: DEFAULT_MAX_FILE_BYTES,
    maxTotalChunks: DEFAULT_MAX_TOTAL_CHUNKS,
    outputFile: DEFAULT_OUTPUT_FILE,
    chunkSize: DEFAULT_CHUNK_SIZE,
    overlap: DEFAULT_CHUNK_OVERLAP,
    enrichAi: envEnrichByDefault,
    enrichmentModel: process.env.AMA_ENRICHMENT_MODEL || DEFAULT_ENRICHMENT_MODEL,
    cacheFile: process.env.AMA_ENRICHMENT_CACHE_FILE || DEFAULT_ENRICHMENT_CACHE_FILE,
    enrichMaxChunks: Number(process.env.AMA_ENRICH_MAX_CHUNKS || DEFAULT_ENRICHMENT_MAX_CHUNKS),
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
    if (token === "--docs-dir") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --docs-dir");
      options.docsDir = value;
      index += 1;
      continue;
    }
    if (token === "--extensions") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --extensions");
      const parsed = value
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
        .map((item) => (item.startsWith(".") ? item : `.${item}`));
      const unique = [...new Set(parsed)];
      if (unique.length === 0) {
        throw new Error("Invalid value for --extensions. Provide a comma-separated list.");
      }
      options.allowedExtensions = unique;
      index += 1;
      continue;
    }
    if (token === "--max-file-bytes") {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value) || value < 1) {
        throw new Error("Invalid value for --max-file-bytes. Use a number >= 1.");
      }
      options.maxFileBytes = Math.trunc(value);
      index += 1;
      continue;
    }
    if (token === "--max-total-chunks") {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value) || value < 1) {
        throw new Error("Invalid value for --max-total-chunks. Use a number >= 1.");
      }
      options.maxTotalChunks = Math.trunc(value);
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
    if (token === "--enrich-ai") {
      options.enrichAi = true;
      continue;
    }
    if (token === "--no-enrich-ai") {
      options.enrichAi = false;
      continue;
    }
    if (token === "--enrichment-model") {
      const value = argv[index + 1];
      if (!value) throw new Error("Missing value for --enrichment-model");
      options.enrichmentModel = value;
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
    if (token === "--enrich-max-chunks") {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value) || value < 0) {
        throw new Error("Invalid value for --enrich-max-chunks. Use a number >= 0.");
      }
      options.enrichMaxChunks = Math.trunc(value);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  if (options.overlap >= options.chunkSize) {
    throw new Error("--overlap must be less than --chunk-size");
  }
  if (!Number.isFinite(options.enrichMaxChunks) || options.enrichMaxChunks < 0) {
    throw new Error("--enrich-max-chunks must be a number >= 0");
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

function toRealPathSafe(targetPath) {
  try {
    return realpathSync(targetPath);
  } catch {
    return path.resolve(targetPath);
  }
}

function collectCorpusFiles({
  directory,
  sourceLabel,
  allowedExtensions,
  maxFileBytes,
  seenCanonicalFiles,
  visitedCanonicalDirs,
  currentRelative = "",
}) {
  const absoluteDir = path.resolve(directory);
  if (!existsSync(absoluteDir)) {
    return [];
  }

  const canonicalDir = toRealPathSafe(absoluteDir);
  if (visitedCanonicalDirs.has(canonicalDir)) {
    return [];
  }
  visitedCanonicalDirs.add(canonicalDir);

  const entries = readdirSync(absoluteDir).sort((a, b) => a.localeCompare(b));
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(absoluteDir, entry);
    const relativePath = path.posix.join(currentRelative, entry);
    const linkStats = lstatSync(absolutePath);
    const stats = statSync(absolutePath);
    if (linkStats.isSymbolicLink() && stats.isDirectory()) {
      // Avoid traversing linked directories so each corpus root is indexed intentionally.
      continue;
    }
    if (stats.isDirectory()) {
      files.push(
        ...collectCorpusFiles({
          directory: absolutePath,
          sourceLabel,
          allowedExtensions,
          maxFileBytes,
          seenCanonicalFiles,
          visitedCanonicalDirs,
          currentRelative: relativePath,
        }),
      );
      continue;
    }

    const ext = path.extname(entry).toLowerCase();
    if (EXCLUDED_EXTENSIONS.has(ext)) {
      continue;
    }
    if (!allowedExtensions.has(ext)) {
      continue;
    }
    if (stats.size > maxFileBytes) {
      continue;
    }

    const canonicalFile = toRealPathSafe(absolutePath);
    if (seenCanonicalFiles.has(canonicalFile)) {
      continue;
    }
    seenCanonicalFiles.add(canonicalFile);

    files.push({
      absolutePath,
      publicPath: `/${sourceLabel}/${relativePath.replace(/\\/gu, "/")}`,
    });
  }
  return files;
}

function extractTokens(value) {
  const unique = new Set();
  const lowered = value.toLowerCase();
  const tokenPattern = /[a-z0-9]{3,48}/gu;
  let match = tokenPattern.exec(lowered);
  while (match) {
    unique.add(match[0]);
    if (unique.size >= 120) {
      break;
    }
    match = tokenPattern.exec(lowered);
  }
  return [...unique];
}

function hashContent(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
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
      const contentHash = hashContent(value);
      chunks.push({
        id: `chunk_${chunkIndex}`,
        text: value,
        tokens: extractTokens(value),
        contentHash,
        summary: "",
        topicTags: [],
        relatedKeys: [],
      });
      chunkIndex += 1;
    }
    if (end >= text.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks;
}

function readCache(cachePath) {
  try {
    return JSON.parse(readFileSync(cachePath, "utf8"));
  } catch {
    return { entries: {} };
  }
}

function writeCache(cachePath, cachePayload) {
  mkdirSync(path.dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(cachePayload), "utf8");
}

function cleanTag(value) {
  return value.toLowerCase().replace(/[^a-z0-9:_-]+/gu, "").slice(0, 32);
}

async function enrichChunkWithGemini({ apiKey, model, chunkTextValue }) {
  const prompt = [
    "Return strict JSON only with keys: summary, topicTags, relatedKeys.",
    "summary: one sentence under 140 chars.",
    "topicTags: 3-7 concise lowercase tags.",
    "relatedKeys: 3-7 normalized concept keys linking related chunks.",
    "Do not include markdown or extra text.",
    "",
    `Text:\n"""${chunkTextValue}"""`,
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`Enrichment request failed (${response.status})`);
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part?.text ?? "").join("") ?? "";
  const parsed = JSON.parse(text);
  const summary = typeof parsed?.summary === "string" ? parsed.summary.trim().slice(0, 180) : "";
  const topicTags = Array.isArray(parsed?.topicTags)
    ? parsed.topicTags.map((item) => cleanTag(String(item))).filter(Boolean).slice(0, 8)
    : [];
  const relatedKeys = Array.isArray(parsed?.relatedKeys)
    ? parsed.relatedKeys.map((item) => cleanTag(String(item))).filter(Boolean).slice(0, 8)
    : [];

  return { summary, topicTags, relatedKeys };
}

async function applyAiEnrichment({ documents, options }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!options.enrichAi || !apiKey) {
    return {
      documents,
      enrichment: {
        enabled: false,
        model: options.enrichmentModel,
        enrichedChunks: 0,
        cacheHits: 0,
        attemptedChunks: 0,
      },
    };
  }

  const absoluteCachePath = path.resolve(process.cwd(), options.cacheFile);
  const cache = readCache(absoluteCachePath);
  const cacheEntries = cache.entries ?? {};
  let enrichedChunks = 0;
  let cacheHits = 0;
  let attemptedChunks = 0;

  for (const doc of documents) {
    for (const chunk of doc.chunks) {
      const cacheEntry = cacheEntries[chunk.contentHash];
      if (cacheEntry) {
        chunk.summary = cacheEntry.summary ?? "";
        chunk.topicTags = Array.isArray(cacheEntry.topicTags) ? cacheEntry.topicTags : [];
        chunk.relatedKeys = Array.isArray(cacheEntry.relatedKeys) ? cacheEntry.relatedKeys : [];
        cacheHits += 1;
        continue;
      }

      if (attemptedChunks >= options.enrichMaxChunks) {
        continue;
      }
      attemptedChunks += 1;

      try {
        const enriched = await enrichChunkWithGemini({
          apiKey,
          model: options.enrichmentModel,
          chunkTextValue: chunk.text,
        });
        chunk.summary = enriched.summary;
        chunk.topicTags = enriched.topicTags;
        chunk.relatedKeys = enriched.relatedKeys;
        cacheEntries[chunk.contentHash] = {
          ...enriched,
          updatedAt: new Date().toISOString(),
        };
        enrichedChunks += 1;
      } catch {
        // Leave chunk enrichment empty and continue; runtime has lexical fallback.
      }
    }
  }

  writeCache(absoluteCachePath, { entries: cacheEntries });

  return {
    documents,
    enrichment: {
      enabled: true,
      model: options.enrichmentModel,
      enrichedChunks,
      cacheHits,
      attemptedChunks,
      cacheFile: absoluteCachePath,
    },
  };
}

export function buildAmaKnowledgeIndex({
  publicDir = DEFAULT_PUBLIC_DIR,
  docsDir = DEFAULT_DOCS_DIR,
  allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS,
  maxFileBytes = DEFAULT_MAX_FILE_BYTES,
  maxTotalChunks = DEFAULT_MAX_TOTAL_CHUNKS,
  outputFile = DEFAULT_OUTPUT_FILE,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_CHUNK_OVERLAP,
  enrichAi = process.env.AMA_ENRICH_AI?.toLowerCase() === "true",
  enrichmentModel = process.env.AMA_ENRICHMENT_MODEL || DEFAULT_ENRICHMENT_MODEL,
  cacheFile = process.env.AMA_ENRICHMENT_CACHE_FILE || DEFAULT_ENRICHMENT_CACHE_FILE,
  enrichMaxChunks = Number(process.env.AMA_ENRICH_MAX_CHUNKS || DEFAULT_ENRICHMENT_MAX_CHUNKS),
} = {}) {
  return buildAmaKnowledgeIndexAsync({
    publicDir,
    docsDir,
    allowedExtensions,
    maxFileBytes,
    maxTotalChunks,
    outputFile,
    chunkSize,
    overlap,
    enrichAi,
    enrichmentModel,
    cacheFile,
    enrichMaxChunks,
  });
}

async function buildAmaKnowledgeIndexAsync({
  publicDir,
  docsDir,
  allowedExtensions,
  maxFileBytes,
  maxTotalChunks,
  outputFile,
  chunkSize,
  overlap,
  enrichAi,
  enrichmentModel,
  cacheFile,
  enrichMaxChunks,
}) {
  const absoluteOutput = path.resolve(process.cwd(), outputFile);
  const normalizedExtensions = new Set(
    allowedExtensions.map((item) => {
      const normalized = String(item).trim().toLowerCase();
      return normalized.startsWith(".") ? normalized : `.${normalized}`;
    }),
  );
  if (normalizedExtensions.size === 0) {
    throw new Error("No allowed extensions configured.");
  }
  for (const excludedExtension of EXCLUDED_EXTENSIONS) {
    normalizedExtensions.delete(excludedExtension);
  }

  const publicExtensions = new Set(DEFAULT_PUBLIC_EXTENSIONS);
  for (const excludedExtension of EXCLUDED_EXTENSIONS) {
    publicExtensions.delete(excludedExtension);
  }

  const sources = [{ directory: publicDir, label: "public", allowedExtensions: publicExtensions }];
  if (docsDir && docsDir.toLowerCase() !== "none") {
    sources.push({ directory: docsDir, label: "docs", allowedExtensions: normalizedExtensions });
  }

  const seenCanonicalFiles = new Set();
  const visitedCanonicalDirs = new Set();
  const corpusFiles = sources.flatMap((source) =>
    collectCorpusFiles({
      directory: source.directory,
      sourceLabel: source.label,
      allowedExtensions: source.allowedExtensions,
      maxFileBytes,
      seenCanonicalFiles,
      visitedCanonicalDirs,
    }),
  );
  corpusFiles.sort((a, b) => a.publicPath.localeCompare(b.publicPath));
  if (corpusFiles.length === 0) {
    throw new Error(
      `No eligible corpus files found. Checked: ${sources.map((source) => path.resolve(process.cwd(), source.directory)).join(", ")}`,
    );
  }

  const baseDocuments = [];
  let totalChunks = 0;
  for (let fileIndex = 0; fileIndex < corpusFiles.length; fileIndex += 1) {
    if (totalChunks >= maxTotalChunks) {
      break;
    }
    const file = corpusFiles[fileIndex];
    const raw = readFileSync(file.absolutePath, "utf8");
    const normalized = normalizeText(raw);
    const chunks = chunkText(normalized, chunkSize, overlap);
    if (!chunks.length) {
      continue;
    }
    const remainingCapacity = maxTotalChunks - totalChunks;
    const limitedChunks = chunks.slice(0, remainingCapacity);
    totalChunks += limitedChunks.length;
    baseDocuments.push({
      id: `doc_${fileIndex}`,
      path: file.publicPath,
      charCount: normalized.length,
      chunks: limitedChunks,
    });
  }

  const { documents, enrichment } = await applyAiEnrichment({
    documents: baseDocuments,
    options: { enrichAi, enrichmentModel, cacheFile, enrichMaxChunks },
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    version: 1,
    source: {
      publicDir: `/${path.relative(process.cwd(), path.resolve(process.cwd(), publicDir)).replace(/\\/gu, "/")}`,
      corpusDirs: sources.map((source) => `/${source.label}`),
      publicExtensions: [...publicExtensions].sort((a, b) => a.localeCompare(b)),
      allowedExtensions: [...normalizedExtensions].sort((a, b) => a.localeCompare(b)),
      maxFileBytes,
      maxTotalChunks,
      totalDocuments: documents.length,
      totalChunks: documents.reduce((sum, doc) => sum + doc.chunks.length, 0),
    },
    enrichment: {
      version: 1,
      ...enrichment,
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
  return runCliAsync(argv);
}

async function runCliAsync(argv = process.argv.slice(2)) {
  const { options, shouldShowHelp } = parseArgs(argv);
  if (shouldShowHelp) {
    console.log(HELP_TEXT);
    return 0;
  }
  const result = await buildAmaKnowledgeIndex(options);
  console.log(
    `[ama-index] Indexed ${result.totalDocuments} documents into ${result.totalChunks} chunks at ${result.outputFile}`,
  );
  return 0;
}

const isCliInvocation =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCliInvocation) {
  try {
    runCli()
      .then((exitCode) => process.exit(exitCode))
      .catch((error) => {
        console.error(`[ama-index] ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      });
  } catch (error) {
    console.error(`[ama-index] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
