#!/usr/bin/env node

import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import chalk from 'chalk';
import boxen from 'boxen';
import { analyzePackageJson } from '../lib/analyze.js';
import { loadConfig } from '../lib/config.js';
import { getCache, setCache } from '../lib/cache.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const args = process.argv.slice(2);
  const filePath = args[0];
  const showVersion = args.includes('--version') || args.includes('-v');
  const showHelp = args.includes('--help') || args.includes('-h');

  if (showVersion) {
    console.log(chalk.greenBright('ByteShrink CLI v1.0.0'));
    process.exit(0);
  }

  if (showHelp || !filePath) {
    console.log(chalk.cyanBright(`
Usage: byteshrink <path/to/package.json> [options]

Options:
  -v, --version       Show CLI version
  -h, --help          Show this help message
    `));
    process.exit(0);
  }

  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const content = await readFile(absolutePath, 'utf-8');
    const pkg = JSON.parse(content);

    const config = await loadConfig();
    const cacheKey = JSON.stringify({ dependencies: pkg.dependencies, devDependencies: pkg.devDependencies });

    const cached = getCache(cacheKey);
    if (cached) {
      console.log(chalk.yellow('⚡ Using cached results:\n'));
      printBoxed(cached);
      return;
    }

    const suggestions = await analyzePackageJson(pkg, config.model || 'deepseek/deepseek-r1:free');
    setCache(cacheKey, suggestions);

    printBoxed(suggestions);
  } catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(chalk.red('❌ Failed to analyze package.json:'), message);
  process.exit(1);
}}

function printBoxed(markdown: string) {
  console.log(
    boxen(chalk.white(markdown), {
      padding: 1,
      borderColor: 'greenBright',
      margin: 1
    })
  );
}

run();
