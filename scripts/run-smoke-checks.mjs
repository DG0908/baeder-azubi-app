const FRONTEND_URL = String(process.env.SMOKE_FRONTEND_URL || 'https://azubi.smartbaden.de').trim();
const FRONTEND_PATH = String(process.env.SMOKE_FRONTEND_PATH || '/').trim() || '/';
const API_BASE_URL = String(process.env.SMOKE_API_BASE_URL || 'https://api.smartbaden.de/api').trim();
// NestJS app uses URI versioning (defaultVersion '1'), so every module route sits under /api/v1/.
// Only VERSION_NEUTRAL controllers (health) remain at /api/ directly.
const API_VERSIONED_BASE_URL = String(process.env.SMOKE_API_VERSIONED_BASE_URL || `${API_BASE_URL.replace(/\/+$/, '')}/v1`).trim();
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 15000);

const roleChecks = [
  {
    label: 'admin',
    email: process.env.SMOKE_ADMIN_EMAIL,
    password: process.env.SMOKE_ADMIN_PASSWORD,
    expectedRole: 'admin'
  },
  {
    label: 'trainer',
    email: process.env.SMOKE_TRAINER_EMAIL,
    password: process.env.SMOKE_TRAINER_PASSWORD,
    expectedRole: 'trainer'
  },
  {
    label: 'azubi',
    email: process.env.SMOKE_AZUBI_EMAIL,
    password: process.env.SMOKE_AZUBI_PASSWORD,
    expectedRole: 'azubi'
  }
];

const results = [];
let hasFailures = false;

const trimTrailingSlash = (value) => String(value || '').replace(/\/+$/, '');

const buildUrl = (base, path) => {
  const normalizedBase = trimTrailingSlash(base);
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path || ''}`;
  return `${normalizedBase}${normalizedPath}`;
};

const fail = (message) => {
  throw new Error(message);
};

const toErrorMessage = (error) => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error || 'unknown error');
};

const logResult = (status, label, message) => {
  const line = `[${status}] ${label}: ${message}`;
  results.push({ status, label, message });
  if (status === 'FAIL') {
    hasFailures = true;
  }
  console.log(line);
};

const fetchWithTimeout = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });

  return response;
};

const parseBody = async (response) => {
  const contentType = String(response.headers.get('content-type') || '').toLowerCase();

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

const request = async (label, url, options = {}) => {
  const response = await fetchWithTimeout(url, options);
  const body = await parseBody(response);

  if (!response.ok) {
    const detail = typeof body === 'string'
      ? body
      : body?.message || body?.error || JSON.stringify(body);
    fail(`${label} failed with HTTP ${response.status}: ${detail}`);
  }

  return body;
};

const runCheck = async (label, fn, options = {}) => {
  try {
    const result = await fn();
    if (options.skipSuccessLog) {
      return result;
    }

    const successMessage = typeof options.successMessage === 'function'
      ? options.successMessage(result)
      : options.successMessage;

    if (typeof successMessage === 'string' && successMessage.length > 0) {
      logResult('OK', label, successMessage);
    } else if (typeof result === 'string' && result.length > 0) {
      logResult('OK', label, result);
    } else {
      logResult('OK', label, 'ok');
    }
    return result;
  } catch (error) {
    logResult('FAIL', label, toErrorMessage(error));
    return null;
  }
};

const validateArrayBody = (label, body) => {
  if (!Array.isArray(body)) {
    fail(`${label} did not return an array`);
  }
  return `${body.length} entries`;
};

const validateObjectBody = (label, body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    fail(`${label} did not return an object`);
  }
  return 'object returned';
};

const roleReadChecks = [
  {
    labelSuffix: 'users-me',
    path: '/users/me',
    validate: (body) => {
      if (!body?.id) {
        fail('users/me did not return a user id');
      }
      return body.email || body.displayName || body.id;
    }
  },
  {
    labelSuffix: 'notifications',
    path: '/notifications',
    validate: (body) => validateArrayBody('notifications', body)
  },
  {
    labelSuffix: 'duels',
    path: '/duels',
    validate: (body) => validateArrayBody('duels', body)
  },
  {
    labelSuffix: 'duel-leaderboard',
    path: '/duels/leaderboard',
    validate: (body) => validateArrayBody('duel leaderboard', body)
  },
  {
    labelSuffix: 'user-stats',
    path: '/user-stats/me',
    validate: (body) => validateObjectBody('user stats', body)
  },
  {
    labelSuffix: 'report-book-profile',
    path: '/report-books/profile',
    validate: (body) => validateObjectBody('report book profile', body)
  },
  {
    labelSuffix: 'app-config',
    path: '/app-config',
    validate: (body) => {
      validateObjectBody('app-config', body);
      if (typeof body.featureFlags !== 'object' || body.featureFlags === null) {
        fail('app-config is missing featureFlags object');
      }
      return `featureFlags present (quizMaintenance=${body.featureFlags.quizMaintenance ?? 'undefined'})`;
    }
  }
];

const adminReadChecks = [
  {
    labelSuffix: 'users-list',
    path: '/users',
    validate: (body) => validateArrayBody('users list', body)
  },
  {
    labelSuffix: 'users-pending',
    path: '/users/pending',
    validate: (body) => validateArrayBody('pending users', body)
  }
];

const checkFrontendShell = async () => {
  const url = buildUrl(FRONTEND_URL, FRONTEND_PATH);
  const response = await fetchWithTimeout(url);
  const body = await parseBody(response);

  if (!response.ok) {
    fail(`frontend shell returned HTTP ${response.status}`);
  }

  if (typeof body !== 'string') {
    fail('frontend shell did not return HTML');
  }

  if (!body.includes('<div id="root"></div>') && !body.includes('<div id="root">')) {
    fail('frontend shell is missing the root container');
  }

  logResult('OK', 'frontend-shell', url);
};

const checkApiHealth = async () => {
  const url = buildUrl(API_BASE_URL, '/health');
  const body = await request('api-health', url);

  if (!body?.ok) {
    fail('api health payload does not contain ok=true');
  }

  logResult('OK', 'api-health', `${url} (${body.timestamp || 'no timestamp'})`);
};

const validateRoleEnv = () => {
  for (const roleCheck of roleChecks) {
    const hasEmail = Boolean(String(roleCheck.email || '').trim());
    const hasPassword = Boolean(String(roleCheck.password || '').trim());

    if (hasEmail !== hasPassword) {
      fail(`role ${roleCheck.label} requires both email and password env vars`);
    }
  }
};

const buildJsonRequest = (body, extraHeaders = {}) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...extraHeaders
  },
  body: JSON.stringify(body)
});

const buildAuthHeaders = (accessToken) => ({
  Authorization: `Bearer ${accessToken}`
});

const runRoleCheck = async (roleCheck) => {
  const email = String(roleCheck.email || '').trim();
  const password = String(roleCheck.password || '');

  if (!email || !password) {
    logResult('SKIP', `${roleCheck.label}-login`, 'no credentials configured');
    return;
  }

  const loginUrl = buildUrl(API_VERSIONED_BASE_URL, '/auth/login');
  const loginBody = await runCheck(`${roleCheck.label}-login`, async () => {
    const body = await request(
      `${roleCheck.label}-login`,
      loginUrl,
      buildJsonRequest({ email, password })
    );

    if (!body?.accessToken) {
      fail(`${roleCheck.label} login did not return an access token`);
    }

    if (!body?.refreshToken) {
      fail(`${roleCheck.label} login did not return a refresh token`);
    }

    const loginRole = String(body?.user?.role || '').toLowerCase();
    if (loginRole && loginRole !== roleCheck.expectedRole) {
      fail(`${roleCheck.label} login returned role ${loginRole}`);
    }

    return body;
  }, {
    skipSuccessLog: false,
    successMessage: () => email
  });

  if (!loginBody?.accessToken || !loginBody?.refreshToken) {
    return;
  }

  const meUrl = buildUrl(API_VERSIONED_BASE_URL, '/auth/me');
  await runCheck(`${roleCheck.label}-me`, async () => {
    const body = await request(`${roleCheck.label}-me`, meUrl, {
      method: 'GET',
      headers: buildAuthHeaders(loginBody.accessToken)
    });

    if (!body?.id) {
      fail(`${roleCheck.label} auth/me did not return a user id`);
    }

    return body.email || body.displayName || body.id;
  });

  const refreshUrl = buildUrl(API_VERSIONED_BASE_URL, '/auth/refresh');
  const refreshBody = await runCheck(`${roleCheck.label}-refresh`, async () => {
    const body = await request(
      `${roleCheck.label}-refresh`,
      refreshUrl,
      buildJsonRequest({ refreshToken: loginBody.refreshToken })
    );

    if (!body?.accessToken) {
      fail(`${roleCheck.label} refresh did not return a new access token`);
    }

    return body;
  }, {
    skipSuccessLog: false,
    successMessage: () => 'refresh token accepted'
  });

  const accessToken = refreshBody?.accessToken || loginBody.accessToken;
  if (!accessToken) {
    return;
  }

  for (const readCheck of roleReadChecks) {
    const url = buildUrl(API_VERSIONED_BASE_URL, readCheck.path);
    await runCheck(`${roleCheck.label}-${readCheck.labelSuffix}`, async () => {
      const body = await request(`${roleCheck.label}-${readCheck.labelSuffix}`, url, {
        method: 'GET',
        headers: buildAuthHeaders(accessToken)
      });
      return readCheck.validate(body);
    });
  }

  const exportUrl = buildUrl(API_VERSIONED_BASE_URL, '/users/me/export');
  await runCheck(`${roleCheck.label}-export`, async () => {
    const exportBody = await request(`${roleCheck.label}-export`, exportUrl, {
      method: 'GET',
      headers: buildAuthHeaders(accessToken)
    });

    if (!exportBody?.account) {
      fail(`${roleCheck.label} export is missing account data`);
    }

    if (exportBody?.meta?.exportedVia !== 'secure-backend') {
      fail(`${roleCheck.label} export meta.exportedVia is not secure-backend`);
    }

    return exportBody.meta.exportedVia;
  });

  if (roleCheck.expectedRole === 'admin') {
    for (const adminCheck of adminReadChecks) {
      const url = buildUrl(API_VERSIONED_BASE_URL, adminCheck.path);
      await runCheck(`${roleCheck.label}-${adminCheck.labelSuffix}`, async () => {
        const body = await request(`${roleCheck.label}-${adminCheck.labelSuffix}`, url, {
          method: 'GET',
          headers: buildAuthHeaders(accessToken)
        });
        return adminCheck.validate(body);
      });
    }
  }
};

/**
 * Security smoke checks (3.8.4):
 *  - Protected endpoints must return 401 without a token
 *  - Admin-only endpoints must return 403 for azubi tokens
 *  - App-config must expose featureFlags
 */
const PROTECTED_PATHS = [
  '/users/me',
  '/duels',
  '/duels/leaderboard',
  '/notifications',
  '/user-stats/me',
  '/report-books/profile',
  '/app-config'
];

// Endpoints where azubi role must receive 403
const ADMIN_ONLY_PATHS = [
  '/users',
  '/users/pending'
];

const checkUnauthenticated401s = async () => {
  for (const path of PROTECTED_PATHS) {
    const url = buildUrl(API_VERSIONED_BASE_URL, path);
    await runCheck(`unauth-401-${path}`, async () => {
      const response = await fetchWithTimeout(url, { method: 'GET' });
      if (response.status !== 401) {
        fail(`expected 401 but got ${response.status}`);
      }
      return `${response.status} as expected`;
    });
  }
};

const checkAzubiRbac403s = async (azubiToken) => {
  if (!azubiToken) {
    logResult('SKIP', 'rbac-403', 'no azubi token — SMOKE_AZUBI_EMAIL/PASSWORD not set');
    return;
  }
  for (const path of ADMIN_ONLY_PATHS) {
    const url = buildUrl(API_VERSIONED_BASE_URL, path);
    await runCheck(`rbac-403-${path}`, async () => {
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: buildAuthHeaders(azubiToken)
      });
      if (response.status !== 403) {
        fail(`expected 403 but got ${response.status}`);
      }
      return `${response.status} as expected`;
    });
  }
};

const main = async () => {
  console.log('Running smoke checks...');
  console.log(`Frontend: ${buildUrl(FRONTEND_URL, FRONTEND_PATH)}`);
  console.log(`API: ${API_BASE_URL} (versioned: ${API_VERSIONED_BASE_URL})`);

  validateRoleEnv();
  await checkFrontendShell();
  await checkApiHealth();
  await checkUnauthenticated401s();

  // Collect azubi token for RBAC check before full role loop
  let azubiToken = null;
  const azubiRoleCheck = roleChecks.find((r) => r.label === 'azubi');
  const azubiEmail = String(azubiRoleCheck?.email || '').trim();
  const azubiPassword = String(azubiRoleCheck?.password || '');
  if (azubiEmail && azubiPassword) {
    const loginUrl = buildUrl(API_VERSIONED_BASE_URL, '/auth/login');
    try {
      const response = await fetchWithTimeout(loginUrl, buildJsonRequest({ email: azubiEmail, password: azubiPassword }));
      const body = await parseBody(response);
      if (response.ok && body?.accessToken) {
        azubiToken = body.accessToken;
      }
    } catch {
      // token acquisition failed — checkAzubiRbac403s will SKIP
    }
  }
  await checkAzubiRbac403s(azubiToken);

  for (const roleCheck of roleChecks) {
    await runRoleCheck(roleCheck);
  }

  const failures = results.filter((entry) => entry.status === 'FAIL');
  if (failures.length > 0 || hasFailures) {
    process.exitCode = 1;
    console.log(`Smoke checks completed with ${failures.length} failure(s).`);
    return;
  }

  console.log('Smoke checks completed.');
};

main().catch((error) => {
  logResult('FAIL', 'smoke-run', toErrorMessage(error));
  process.exitCode = 1;
});
