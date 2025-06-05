import fetch from 'node-fetch';
import { z } from 'zod';

const ResponseSchema = z.object({
  suggestions: z.string().optional(),
  error: z.string().optional()
});

export async function analyzePackageJson(pkg: any, model: string): Promise<string> {
  const response = await fetch("https://api.byteshrink.dev/api/optimize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Model": model
    },
    body: JSON.stringify({
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {}
    })
  });

  const raw = await response.json();
  const result = ResponseSchema.safeParse(raw);

  if (!result.success) {
    return "Invalid response format from API.";
  }

  const data = result.data;

  if (data.suggestions) {
    return data.suggestions;
  } else if (data.error) {
    return `Error: ${data.error}`;
  } else {
    return "No suggestions received.";
  }
}
