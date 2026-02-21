#!/usr/bin/env node

/**
 * Pre-deployment check script for Michael Simoneau's portfolio
 * This script verifies that all necessary files and configurations are in place
 * before deployment.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.cyan.bold('🔍 Running pre-deployment checks...\n'));

// Files that must exist before deployment
const requiredFiles = [
  { path: 'public/robots.txt', name: 'Robots.txt' },
  { path: 'public/sitemap.xml', name: 'Sitemap' },
  { path: 'netlify.toml', name: 'Netlify config' },
];

// Check for required files
let allFilesExist = true;
console.log(chalk.yellow('Checking required files:'));

requiredFiles.forEach(file => {
  if (fs.existsSync(path.resolve(process.cwd(), file.path))) {
    console.log(chalk.green(`✓ ${file.name} exists`));
  } else {
    console.log(chalk.red(`✗ Missing ${file.name} (${file.path})`));
    allFilesExist = false;
  }
});

// Check for social media images
console.log('\n' + chalk.yellow('Checking social media assets:'));
const socialMediaImages = [
  { path: 'public/og-image.jpg', name: 'Open Graph image' },
  { path: 'public/favicon.ico', name: 'Favicon' },
];

let allSocialMediaAssetsExist = true;
socialMediaImages.forEach(file => {
  const filePath = path.resolve(process.cwd(), file.path);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    if (fileSizeInBytes > 100) { // Check if file is not empty (at least 100 bytes)
      console.log(chalk.green(`✓ ${file.name} exists (${fileSizeInBytes} bytes)`));
    } else {
      console.log(chalk.red(`✗ ${file.name} exists but may be empty or corrupt (${fileSizeInBytes} bytes)`));
      allSocialMediaAssetsExist = false;
    }
  } else {
    console.log(chalk.red(`✗ Missing ${file.name} (${file.path})`));
    allSocialMediaAssetsExist = false;
  }
});

// Verify package.json has deployment scripts
console.log('\n' + chalk.yellow('Checking package.json configuration:'));
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
let packageJsonValid = true;

if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for deployment scripts
    const requiredScripts = ['build', 'start', 'deploy'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts || !packageJson.scripts[script]);
    
    if (missingScripts.length === 0) {
      console.log(chalk.green('✓ All required npm scripts exist'));
    } else {
      console.log(chalk.red(`✗ Missing npm scripts: ${missingScripts.join(', ')}`));
      packageJsonValid = false;
    }
  } catch (e) {
    console.log(chalk.red('✗ Error parsing package.json'));
    packageJsonValid = false;
  }
} else {
  console.log(chalk.red('✗ Missing package.json'));
  packageJsonValid = false;
}

// Check for Netlify config validity
console.log('\n' + chalk.yellow('Checking Netlify configuration:'));
let netlifyConfigValid = true;

const netlifyConfigPath = path.resolve(process.cwd(), 'netlify.toml');
if (fs.existsSync(netlifyConfigPath)) {
  try {
    const netlifyConfig = fs.readFileSync(netlifyConfigPath, 'utf8');
    
    // Check for build configuration
    if (netlifyConfig.includes('[build]') && netlifyConfig.includes('publish')) {
      console.log(chalk.green('✓ Netlify config is valid'));
    } else {
      console.log(chalk.red('✗ Netlify config is missing required [build] section'));
      netlifyConfigValid = false;
    }
  } catch (e) {
    console.log(chalk.red('✗ Error parsing netlify.toml'));
    netlifyConfigValid = false;
  }
} else {
  // Already reported as missing in requiredFiles check
  netlifyConfigValid = false;
}

// Overall status
console.log('\n' + chalk.cyan.bold('📋 Pre-deployment check summary:'));

if (allFilesExist && allSocialMediaAssetsExist && packageJsonValid && netlifyConfigValid) {
  console.log(chalk.green.bold('✅ All checks passed! You are ready to deploy.\n'));
  process.exit(0);
} else {
  console.log(chalk.red.bold('❌ Some checks failed. Please fix the issues before deploying.\n'));
  process.exit(1);
} 