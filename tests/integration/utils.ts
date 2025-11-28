import { NextRequest } from 'next/server';

export function createJsonRequest(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const request = new Request(`http://localhost${path}`, {
    method,
    headers: mergedHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  return new NextRequest(request);
}

export async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}

export function uniqueEmail(prefix = 'user'): string {
  return `${prefix}+${Date.now()}${Math.round(Math.random() * 1000)}@example.com`;
}

