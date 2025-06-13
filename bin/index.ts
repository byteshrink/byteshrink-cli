#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { analyze } from '../lib/analyze.js';
import { getCache, setCache } from '../lib/cache.js';
import { loadConfig } from '../lib/config.js';
import ora from 'ora';

const spinner = ora('Analyzing your project...').start();

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(chalk.red('❌ Please provide a path to package.json'));
  process.exit(1);
}

const filePath = args[0];

if (!existsSync(filePath)) {
  console.log(chalk.red(`❌ File not found: ${filePath}`));
  process.exit(1);
}

(async () => {
  try {
    const config = await loadConfig();
    const absolutePath = path.resolve(process.cwd(), filePath);
    const contents = await readFile(absolutePath, 'utf-8');
    const json = JSON.parse(contents);
    const combinedDeps = {
  ...json.dependencies,
  ...json.devDependencies,
  };
    const cacheKey = JSON.stringify(combinedDeps || {});
    const cached = config.cache !== false ? getCache(cacheKey) : null;

    if (cached) {
      console.log(chalk.yellow('⚡ Using cached results:\n'));
      printBoxed(cached);
      process.exit(0);
    }


    const suggestions = await analyze(json);

    if (config.cache !== false) {
      setCache(cacheKey, suggestions);
    }
    spinner.succeed('Analysis complete!');
    printBoxed(suggestions);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    spinner.fail('Something went wrong.');
    console.error(chalk.red('❌ Failed to analyze package.json:'), message);
    process.exit(1);
  }
})();

function printBoxed(content: string) {
  const box = boxen(content, {
    padding: 1,
    borderColor: 'green',
    borderStyle: 'round',
  });
  console.log(box);
}
