#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HELP_TEXT = `Run timed web build steps.

Usage:
  node scripts/build-web-timed.mjs [options]

Options:
  --with-content    Include sitemap + AMA index steps before web export
  --help            Show this help message
`;

function parseArgs(argv) {
  const options = {
    withContent: false,
  };

  for (const token of argv) {
    if (token === "--help" || token === "-h") {
      return { options, shouldShowHelp: true };
    }
    if (token === "--with-content") {
      options.withContent = true;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  return { options, shouldShowHelp: false };
}

function runStep(step) {
  const startedAt = Date.now();
  console.log(`== ${step.name} ==`);
  const command = process.platform === "win32" ? "cmd" : "sh";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", step.command] : ["-c", step.command];
  const result = spawnSync(command, args, { stdio: "inherit", cwd: process.cwd(), env: process.env });
  const elapsedMs = Date.now() - startedAt;
  return { ...step, elapsedMs, exitCode: result.status ?? 1 };
}

export function runTimedBuild({ withContent = false } = {}) {
  const steps = [];
  if (withContent) {
    steps.push(
      { name: "sitemaps", command: "node scripts/generate-sitemaps.mjs" },
      { name: "ama-index", command: "node scripts/build-ama-knowledge-index.mjs --no-enrich-ai" },
    );
  }
  steps.push(
    { name: "expo-export", command: "npx expo export --platform web" },
    { name: "post-build-web", command: "node scripts/post-build-web.cjs" },
    { name: "static-sync", command: "node scripts/sync-static-web.mjs" },
  );

  const results = [];
  for (const step of steps) {
    const result = runStep(step);
    results.push(result);
    if (result.exitCode !== 0) {
      break;
    }
  }

  const summaryLines = ["", "== timed-build-summary ==", ...results.map((result) => {
    const seconds = (result.elapsedMs / 1000).toFixed(2);
    return `${result.name}: ${seconds}s (exit ${result.exitCode})`;
  })];

  const totalSeconds = (results.reduce((sum, step) => sum + step.elapsedMs, 0) / 1000).toFixed(2);
  summaryLines.push(`total: ${totalSeconds}s`, "");
  console.log(summaryLines.join("\n"));

  const failed = results.find((step) => step.exitCode !== 0);
  return failed ? failed.exitCode : 0;
}

export function runCli(argv = process.argv.slice(2)) {
  const { options, shouldShowHelp } = parseArgs(argv);
  if (shouldShowHelp) {
    console.log(HELP_TEXT);
    return 0;
  }
  return runTimedBuild(options);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exit(runCli());
  } catch (error) {
    console.error(`[build-timed] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
