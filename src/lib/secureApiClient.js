const DEFAULT_API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '/api').trim() || '/api';
const ENABLE_SECURE_BACKEND_API = String(import.meta.env.VITE_ENABLE_SECURE_BACKEND_API || '')
  .trim()
  .toLowerCase() === 'true';

let inMemoryAccessToken = '';
let refreshPromise = null;

// Clean up legacy localStorage refresh token if present from older app versions
try { localStorage.removeItem('baeder_rt'); } catch { /* ignore */ }

export class ApiRequestError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.details = details;
  }
}

const buildUrl = (path) => {
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path || ''}`;
  const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
  return new URL(`${DEFAULT_API_BASE_URL}${normalizedPath}`, fallbackOrigin).toString();
};

const parseResponseBody = async (response) => {
  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
};

export const getApiAccessToken = () => {
  return inMemoryAccessToken;
};

export const setApiAccessToken = (token) => {
  inMemoryAccessToken = String(token || '').trim();
};

export const clearApiAccessToken = () => {
  setApiAccessToken('');
};

export const isSecureBackendApiEnabled = () => ENABLE_SECURE_BACKEND_API;

export const refreshApiSession = async () => {
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
          body?.message || body?.error || 'API session refresh failed.',
          response.status,
          body
        );
      }

      if (body?.accessToken) {
        setApiAccessToken(body.accessToken);
      }

      return body;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const apiRequest = async (path, options = {}, retry = true) => {
  const skipRefreshPaths = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/password-reset', '/auth/2fa/authenticate'];
  const shouldSkipRefresh = skipRefreshPaths.some(p => String(path).startsWith(p));
  const accessToken = getApiAccessToken();

  if (!accessToken && retry && !shouldSkipRefresh) {
    await refreshApiSession();
    return apiRequest(path, options, false);
  }

  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
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
      body?.message || body?.error || `API request failed (${response.status}).`,
      response.status,
      body
    );
  }

  return body;
};
