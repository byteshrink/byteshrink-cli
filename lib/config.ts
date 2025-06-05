import path from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

type Config = {
  model?: string;
  cache?: boolean;
};

export async function loadConfig(): Promise<Config> {
  const configPath = path.resolve(process.cwd(), '.byteshrinkrc');

  if (existsSync(configPath)) {
    try {
      const content = await readFile(configPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  return {};
}