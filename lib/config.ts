import path from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function loadConfig(): Promise<{ model?: string }> {
  const configPath = path.resolve(process.cwd(), '.byteshrinkrc');
  if (!existsSync(configPath)) return {};

  try {
    const raw = await readFile(configPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
