import { z } from 'zod';

const API_URL = 'https://api.byteshrink.dev/api/optimize';
const DEFAULT_MODEL = 'deepseek/deepseek-r1:free';

const ResponseSchema = z.object({
  suggestions: z.string().optional(),
  error: z.string().optional(),
});

export async function analyze(pkg: Record<string, any>): Promise<string> {
  console.log(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Model': DEFAULT_MODEL,
    },
    body: JSON.stringify(pkg),
  })
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Model': DEFAULT_MODEL,
    },
    body: JSON.stringify(pkg),
  });


const contentType = response.headers.get('content-type');

if (!response.ok) {
  const text = await response.text();
  throw new Error(`API error (${response.status}): ${text}`);
}

if (!contentType?.includes('application/json')) {
  const text = await response.text();
  throw new Error(`Expected JSON but got: ${text}`);
}

  const json = await response.json();
  const parsed = ResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error('Invalid response format from server.');
  }

  const data = parsed.data;

  if (data.suggestions) return data.suggestions;
  if (data.error) return `Error: ${data.error}`;
  return 'No suggestions received.';
}