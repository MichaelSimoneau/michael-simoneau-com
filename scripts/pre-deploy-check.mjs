#!/usr/bin/env node

/**
 * Pre-deployment check script for Michael Simoneau's portfolio
 * This script verifies that all necessary files and configurations are in place
 * before deployment.
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import chalk from 'chalk';

console.log(chalk.cyan.bold('🔍 Running pre-deployment checks...\n'));

const resolveFromRoot = (relativePath) => path.resolve(process.cwd(), relativePath);

// Files that must exist before deployment
const requiredFiles = [
  { path: 'public/robots.txt', name: 'Robots.txt' },
  { path: 'public/sitemap.xml', name: 'Sitemap' },
  { path: 'netlify.toml', name: 'Netlify config' },
];

// Check for required files
let allFilesExist = true;
console.log(chalk.yellow('Checking required files:'));

for (const file of requiredFiles) {
  if (existsSync(resolveFromRoot(file.path))) {
    console.log(chalk.green(`✓ ${file.name} exists`));
  } else {
    console.log(chalk.red(`✗ Missing ${file.name} (${file.path})`));
    allFilesExist = false;
  }
}

// Check for social media images
console.log('\n' + chalk.yellow('Checking social media assets:'));
const socialMediaImages = [
  {
    name: 'Open Graph image',
    paths: ['public/og-image.jpg', 'public/og-image.png', 'public/og-image.svg'],
  },
  {
    name: 'Favicon',
    paths: ['public/favicon.ico', 'public/favicon.png', 'public/favicon.svg'],
  },
];

let allSocialMediaAssetsExist = true;
for (const asset of socialMediaImages) {
  const resolvedPath = asset.paths
    .map((candidate) => ({ candidate, fullPath: resolveFromRoot(candidate) }))
    .find(({ fullPath }) => existsSync(fullPath));

  if (resolvedPath) {
    const { candidate, fullPath } = resolvedPath;
    const stats = statSync(fullPath);
    const fileSizeInBytes = stats.size;
    if (fileSizeInBytes > 100) {
      console.log(chalk.green(`✓ ${asset.name} exists (${candidate}, ${fileSizeInBytes} bytes)`));
    } else {
      console.log(
        chalk.red(
          `✗ ${asset.name} exists but may be empty or corrupt (${candidate}, ${fileSizeInBytes} bytes)`,
        ),
      );
      allSocialMediaAssetsExist = false;
    }
  } else {
    console.log(chalk.red(`✗ Missing ${asset.name} (${asset.paths.join(' or ')})`));
    allSocialMediaAssetsExist = false;
  }
}

// Verify package.json has deployment scripts
console.log('\n' + chalk.yellow('Checking package.json configuration:'));
const packageJsonPath = resolveFromRoot('package.json');
let packageJsonValid = true;

if (existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    const requiredScripts = ['build', 'release'];
    const missingScripts = requiredScripts.filter(
      (scriptName) => !packageJson.scripts || !packageJson.scripts[scriptName],
    );

    if (missingScripts.length === 0) {
      console.log(chalk.green('✓ Required package scripts exist (build, release)'));
    } else {
      console.log(chalk.red(`✗ Missing package scripts: ${missingScripts.join(', ')}`));
      packageJsonValid = false;
    }
  } catch (error) {
    console.log(chalk.red('✗ Error parsing package.json'));
    packageJsonValid = false;
  }
} else {
  console.log(chalk.red('✗ Missing package.json'));
  packageJsonValid = false;
}

// Check Netlify configuration validity
console.log('\n' + chalk.yellow('Checking Netlify configuration:'));
let netlifyConfigValid = true;
const netlifyConfigPath = resolveFromRoot('netlify.toml');

if (existsSync(netlifyConfigPath)) {
  try {
    const netlifyToml = readFileSync(netlifyConfigPath, 'utf8');
    const hasBuildSection = /\[build\]/.test(netlifyToml);
    const hasCommand = /command\s*=\s*".+"/.test(netlifyToml);
    const hasPublish = /publish\s*=\s*".+"/.test(netlifyToml);

    if (hasBuildSection && hasCommand && hasPublish) {
      console.log(chalk.green('✓ Netlify build configuration is present'));
    } else {
      console.log(
        chalk.red('✗ Netlify config is missing build.command or build.publish definitions'),
      );
      netlifyConfigValid = false;
    }
  } catch (error) {
    console.log(chalk.red('✗ Error reading netlify.toml'));
    netlifyConfigValid = false;
  }
} else {
  netlifyConfigValid = false;
}

// Overall status
console.log('\n' + chalk.cyan.bold('📋 Pre-deployment check summary:'));

if (allFilesExist && allSocialMediaAssetsExist && packageJsonValid && netlifyConfigValid) {
  console.log(chalk.green.bold('✅ All checks passed! You are ready to deploy.\n'));
  process.exit(0);
}

console.log(chalk.red.bold('❌ Some checks failed. Please fix the issues before deploying.\n'));
process.exit(1);
