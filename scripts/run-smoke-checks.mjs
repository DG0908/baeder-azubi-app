const FRONTEND_URL = String(process.env.SMOKE_FRONTEND_URL || 'https://azubi.smartbaden.de').trim();
const FRONTEND_PATH = String(process.env.SMOKE_FRONTEND_PATH || '/').trim() || '/';
const API_BASE_URL = String(process.env.SMOKE_API_BASE_URL || 'https://api.smartbaden.de/api').trim();
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

  const loginUrl = buildUrl(API_BASE_URL, '/auth/login');
  const loginBody = await request(
    `${roleCheck.label}-login`,
    loginUrl,
    buildJsonRequest({ email, password })
  );

  if (!loginBody?.accessToken) {
    fail(`${roleCheck.label} login did not return an access token`);
  }

  if (!loginBody?.refreshToken) {
    fail(`${roleCheck.label} login did not return a refresh token`);
  }

  const loginRole = String(loginBody?.user?.role || '').toLowerCase();
  if (loginRole && loginRole !== roleCheck.expectedRole) {
    fail(`${roleCheck.label} login returned role ${loginRole}`);
  }

  logResult('OK', `${roleCheck.label}-login`, email);

  const meUrl = buildUrl(API_BASE_URL, '/auth/me');
  const meBody = await request(`${roleCheck.label}-me`, meUrl, {
    method: 'GET',
    headers: buildAuthHeaders(loginBody.accessToken)
  });

  if (!meBody?.id) {
    fail(`${roleCheck.label} auth/me did not return a user id`);
  }

  logResult('OK', `${roleCheck.label}-me`, meBody.email || meBody.displayName || meBody.id);

  const refreshUrl = buildUrl(API_BASE_URL, '/auth/refresh');
  const refreshBody = await request(
    `${roleCheck.label}-refresh`,
    refreshUrl,
    buildJsonRequest({ refreshToken: loginBody.refreshToken })
  );

  if (!refreshBody?.accessToken) {
    fail(`${roleCheck.label} refresh did not return a new access token`);
  }

  logResult('OK', `${roleCheck.label}-refresh`, 'refresh token accepted');

  const exportUrl = buildUrl(API_BASE_URL, '/users/me/export');
  const exportBody = await request(`${roleCheck.label}-export`, exportUrl, {
    method: 'GET',
    headers: buildAuthHeaders(refreshBody.accessToken)
  });

  if (!exportBody?.account) {
    fail(`${roleCheck.label} export is missing account data`);
  }

  if (exportBody?.meta?.exportedVia !== 'secure-backend') {
    fail(`${roleCheck.label} export meta.exportedVia is not secure-backend`);
  }

  logResult('OK', `${roleCheck.label}-export`, exportBody.meta.exportedVia);
};

const main = async () => {
  console.log('Running smoke checks...');
  console.log(`Frontend: ${buildUrl(FRONTEND_URL, FRONTEND_PATH)}`);
  console.log(`API: ${API_BASE_URL}`);

  validateRoleEnv();
  await checkFrontendShell();
  await checkApiHealth();

  for (const roleCheck of roleChecks) {
    await runRoleCheck(roleCheck);
  }

  const failures = results.filter((entry) => entry.status === 'FAIL');
  if (failures.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log('Smoke checks completed.');
};

main().catch((error) => {
  logResult('FAIL', 'smoke-run', toErrorMessage(error));
  process.exitCode = 1;
});
