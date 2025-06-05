const cache = new Map<string, string>();

export function getCache(key: string): string | null {
  return cache.has(key) ? cache.get(key)! : null;
}

export function setCache(key: string, value: string): void {
  cache.set(key, value);
}
