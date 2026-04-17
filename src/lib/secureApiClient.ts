const DEFAULT_API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '/api').trim() || '/api';
const ENABLE_SECURE_BACKEND_API = String(import.meta.env.VITE_ENABLE_SECURE_BACKEND_API || '')
  .trim()
  .toLowerCase() === 'true';

let inMemoryAccessToken = '';
let refreshPromise: Promise<unknown> | null = null;

// Clean up legacy localStorage refresh token if present from older app versions
try { localStorage.removeItem('baeder_rt'); } catch { /* ignore */ }

export class ApiRequestError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status = 500, details: unknown = null) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.details = details;
  }
}

interface ApiRequestOptions extends RequestInit {
  headers?: HeadersInit;
}

const buildUrl = (path: string): string => {
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path || ''}`;
  const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
  return new URL(`${DEFAULT_API_BASE_URL}${normalizedPath}`, fallbackOrigin).toString();
};

const parseResponseBody = async (response: Response): Promise<Record<string, unknown> | null> => {
  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
};

export const getApiAccessToken = (): string => {
  return inMemoryAccessToken;
};

export const setApiAccessToken = (token: string): void => {
  inMemoryAccessToken = String(token || '').trim();
};

export const clearApiAccessToken = (): void => {
  setApiAccessToken('');
};

export const isSecureBackendApiEnabled = (): boolean => ENABLE_SECURE_BACKEND_API;

export const refreshApiSession = async (): Promise<unknown> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(buildUrl('/auth/refresh'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const body = await parseResponseBody(response);

      if (!response.ok) {
        clearApiAccessToken();
        throw new ApiRequestError(
          (body?.message as string) || (body?.error as string) || 'API session refresh failed.',
          response.status,
          body
        );
      }

      if (body?.accessToken) {
        setApiAccessToken(body.accessToken as string);
      }

      return body;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const apiRequest = async (path: string, options: ApiRequestOptions = {}, retry = true): Promise<unknown> => {
  const skipRefreshPaths = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/password-reset', '/auth/2fa/authenticate'];
  const shouldSkipRefresh = skipRefreshPaths.some(p => String(path).startsWith(p));
  const accessToken = getApiAccessToken();

  if (!accessToken && retry && !shouldSkipRefresh) {
    await refreshApiSession();
    return apiRequest(path, options, false);
  }

  const headers = new Headers(options.headers as HeadersInit | undefined);

  if (!headers.has('Content-Type') && options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  // CSRF protection: browsers cannot set X-Requested-With in cross-origin
  // requests without a CORS preflight, which our strict CORS policy blocks.
  if (!headers.has('X-Requested-With')) {
    headers.set('X-Requested-With', 'XMLHttpRequest');
  }

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    credentials: 'include'
  });

  if (response.status === 401 && retry && !shouldSkipRefresh) {
    try {
      await refreshApiSession();
      return apiRequest(path, options, false);
    } catch {
      // Fall through and return original unauthorized response handling below.
    }
  }

  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiRequestError(
      (body?.message as string) || (body?.error as string) || `API request failed (${response.status}).`,
      response.status,
      body
    );
  }

  return body;
};
