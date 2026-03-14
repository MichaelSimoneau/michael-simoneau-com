#!/usr/bin/env node

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const DEFAULT_BASE_URL = "https://michaelsimoneau.com";
const DEFAULT_OUTPUT_DIR = "public";
const DEFAULT_BLOG_DATA_FILE = "src/features/blog/data/posts.ts";
const DEFAULT_APP_DIR = "app";
const DEFAULT_PAGES_SITEMAP_FILE = "public/sitemap-pages.xml";
const EXCLUDED_PAGE_ROUTES = new Set(["/melinda"]);

const HELP_TEXT = `Generate sitemap XML files for the site.

Usage:
  node scripts/generate-sitemaps.mjs [options]

Options:
  --base-url <url>      Canonical base URL (default: ${DEFAULT_BASE_URL})
  --output-dir <path>   Directory to write sitemap XML files (default: ${DEFAULT_OUTPUT_DIR})
  --date <YYYY-MM-DD>   Fixed lastmod date for all generated entries (default: today UTC)
  --help                Show this help message
`;

function parseArgs(argv) {
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    outputDir: DEFAULT_OUTPUT_DIR,
    date: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      return { options, shouldShowHelp: true };
    }

    if (token === "--base-url") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --base-url");
      }
      options.baseUrl = value;
      index += 1;
      continue;
    }

    if (token === "--output-dir") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --output-dir");
      }
      options.outputDir = value;
      index += 1;
      continue;
    }

    if (token === "--date") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --date");
      }
      options.date = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return { options, shouldShowHelp: false };
}

function normalizeBaseUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid --base-url value: ${rawUrl}`);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`--base-url must use http/https, received: ${parsed.protocol}`);
  }

  return parsed.toString().replace(/\/$/, "");
}

function normalizeIsoDate(rawDate) {
  if (!rawDate) {
    return new Date().toISOString().slice(0, 10);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    throw new Error(`--date must be formatted as YYYY-MM-DD, received: ${rawDate}`);
  }

  const parsed = new Date(`${rawDate}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`--date is not a valid calendar date: ${rawDate}`);
  }

  return rawDate;
}

function toRoutePath(segments) {
  const normalized = segments
    .map((segment) => segment.replace(/\.(tsx|ts|jsx|js)$/u, ""))
    .filter((segment) => segment !== "index");

  const route = `/${normalized.join("/")}`.replace(/\/{2,}/gu, "/");
  return route === "/" ? route : route.replace(/\/$/u, "");
}

function collectRoutes(directory, currentSegments = []) {
  const entries = readdirSync(directory).sort((first, second) => first.localeCompare(second));
  const routes = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      routes.push(...collectRoutes(absolutePath, [...currentSegments, entry]));
      continue;
    }

    if (!/\.(tsx|ts|jsx|js)$/u.test(entry)) {
      continue;
    }

    const baseName = entry.replace(/\.(tsx|ts|jsx|js)$/u, "");
    if (baseName.startsWith("_") || baseName.startsWith("+")) {
      continue;
    }

    if (baseName.includes("[") || currentSegments.some((segment) => segment.includes("["))) {
      continue;
    }

    routes.push(toRoutePath([...currentSegments, entry]));
  }

  return routes;
}

function parseBlogEntries(postsFilePath) {
  const source = readFileSync(postsFilePath, "utf8");
  const entries = [];
  const pattern =
    /\{\s*[\r\n]+\s*id:\s*"([^"]+)"[\s\S]*?\s*date:\s*"([^"]+)"[\s\S]*?\s*readTime:\s*"[^"]+"/gu;

  for (const match of source.matchAll(pattern)) {
    const id = match[1];
    const dateLabel = match[2];
    const parsedDate = new Date(dateLabel);
    const lastmod = Number.isNaN(parsedDate.getTime())
      ? new Date().toISOString().slice(0, 10)
      : parsedDate.toISOString().slice(0, 10);

    entries.push({ id, lastmod });
  }

  if (entries.length === 0) {
    throw new Error(`Unable to parse blog entries from ${postsFilePath}`);
  }

  const uniqueById = new Map();
  for (const entry of entries) {
    uniqueById.set(entry.id, entry);
  }

  return [...uniqueById.values()].sort((first, second) => second.lastmod.localeCompare(first.lastmod));
}

function parseExistingPageMetadata(filePath, baseUrl) {
  let xml = "";
  try {
    xml = readFileSync(filePath, "utf8");
  } catch {
    return new Map();
  }

  const metadata = new Map();
  const urlPattern =
    /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>[^<]*<\/lastmod>\s*<changefreq>([^<]+)<\/changefreq>\s*<priority>([^<]+)<\/priority>\s*<\/url>/gu;

  for (const match of xml.matchAll(urlPattern)) {
    const absoluteLoc = match[1].trim();
    const changefreq = match[2].trim();
    const priority = match[3].trim();
    const relativePath = absoluteLoc.startsWith(baseUrl)
      ? absoluteLoc.slice(baseUrl.length) || "/"
      : absoluteLoc;
    metadata.set(relativePath, { changefreq, priority });
  }

  return metadata;
}

function xmlEscape(value) {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&apos;");
}

function renderUrlSet(entries) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const entry of entries) {
    lines.push("  <url>");
    lines.push(`    <loc>${xmlEscape(entry.loc)}</loc>`);
    lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    lines.push(`    <priority>${entry.priority}</priority>`);
    lines.push("  </url>");
  }
  lines.push("</urlset>", "");
  return lines.join("\n");
}

function renderSitemapIndex(entries) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const entry of entries) {
    lines.push("  <sitemap>");
    lines.push(`    <loc>${xmlEscape(entry.loc)}</loc>`);
    lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    lines.push("  </sitemap>");
  }
  lines.push("</sitemapindex>", "");
  return lines.join("\n");
}

function resolveDefaultPageMetadata(relativePath) {
  if (relativePath === "/") {
    return { changefreq: "weekly", priority: "1.0" };
  }
  if (relativePath.startsWith("/blog")) {
    return { changefreq: "daily", priority: "0.9" };
  }
  if (relativePath.startsWith("/interview")) {
    return { changefreq: "monthly", priority: "0.7" };
  }
  return { changefreq: "weekly", priority: "0.85" };
}

function normalizeRouteForExclusion(routeLike) {
  let pathCandidate = routeLike;

  try {
    pathCandidate = new URL(routeLike).pathname;
  } catch {
    // Keep non-URL values as-is (e.g., "/melinda", "/melinda#section").
  }

  const withoutHash = pathCandidate.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];
  if (withoutQuery === "/") {
    return "/";
  }
  return withoutQuery.replace(/\/$/u, "");
}

function isExcludedRoute(relativePath) {
  const normalizedPath = normalizeRouteForExclusion(relativePath);
  return EXCLUDED_PAGE_ROUTES.has(normalizedPath);
}

export function buildSitemaps({
  baseUrl = DEFAULT_BASE_URL,
  outputDir = DEFAULT_OUTPUT_DIR,
  date = null,
  blogDataFile = DEFAULT_BLOG_DATA_FILE,
  appDir = DEFAULT_APP_DIR,
  existingPagesSitemapFile = DEFAULT_PAGES_SITEMAP_FILE,
} = {}) {
  const canonicalBaseUrl = normalizeBaseUrl(baseUrl);
  const today = normalizeIsoDate(date);
  const absoluteOutputDir = path.resolve(process.cwd(), outputDir);
  const absoluteBlogDataFile = path.resolve(process.cwd(), blogDataFile);
  const absoluteAppDir = path.resolve(process.cwd(), appDir);
  const absoluteExistingPagesSitemapFile = path.resolve(process.cwd(), existingPagesSitemapFile);

  const routePaths = [...new Set(collectRoutes(absoluteAppDir))]
    .filter((relativePath) => !isExcludedRoute(relativePath))
    .sort();
  if (routePaths.length === 0) {
    throw new Error(`No routes discovered in ${absoluteAppDir}`);
  }

  const existingPageMetadata = parseExistingPageMetadata(
    absoluteExistingPagesSitemapFile,
    canonicalBaseUrl,
  );
  const fragmentPaths = [...existingPageMetadata.keys()].filter(
    (relativePath) => relativePath.includes("#") && !isExcludedRoute(relativePath),
  );

  const pages = [...new Set([...routePaths, ...fragmentPaths])].sort();
  const pageEntries = pages.map((relativePath) => {
    const metadata = existingPageMetadata.get(relativePath) ?? resolveDefaultPageMetadata(relativePath);
    return {
      loc: `${canonicalBaseUrl}${relativePath}`,
      lastmod: today,
      changefreq: metadata.changefreq,
      priority: metadata.priority,
    };
  });

  const blogEntries = parseBlogEntries(absoluteBlogDataFile).map((entry) => ({
    loc: `${canonicalBaseUrl}/blog/${entry.id}`,
    lastmod: entry.lastmod,
    changefreq: "weekly",
    priority: "0.9",
  }));

  const indexEntries = [
    { loc: `${canonicalBaseUrl}/sitemap-pages.xml`, lastmod: today },
    { loc: `${canonicalBaseUrl}/sitemap-blog.xml`, lastmod: today },
  ];

  mkdirSync(absoluteOutputDir, { recursive: true });
  writeFileSync(path.join(absoluteOutputDir, "sitemap-pages.xml"), renderUrlSet(pageEntries), "utf8");
  writeFileSync(path.join(absoluteOutputDir, "sitemap-blog.xml"), renderUrlSet(blogEntries), "utf8");
  writeFileSync(path.join(absoluteOutputDir, "sitemap.xml"), renderSitemapIndex(indexEntries), "utf8");

  return {
    outputDir: absoluteOutputDir,
    pagesCount: pageEntries.length,
    blogsCount: blogEntries.length,
  };
}

export function runCli(argv = process.argv.slice(2)) {
  const { options, shouldShowHelp } = parseArgs(argv);
  if (shouldShowHelp) {
    console.log(HELP_TEXT);
    return 0;
  }

  const result = buildSitemaps(options);
  console.log(
    `[sitemaps] Generated ${result.pagesCount} page URLs and ${result.blogsCount} blog URLs in ${result.outputDir}`,
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
    console.error(`[sitemaps] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
