const STORAGE_KEY = 'alfred:auth';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { token: string };
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

