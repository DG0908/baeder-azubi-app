/**
 * Playwright global setup.
 *
 * Requires the following env vars (set them in .env.e2e or export manually):
 *   E2E_ADMIN_EMAIL    – email of an existing admin user
 *   E2E_ADMIN_PASSWORD – password of the admin user
 *   E2E_API_URL        – backend API base (default: http://localhost:3000)
 *
 * This setup:
 *  1. Logs in as admin
 *  2. Creates a fresh invitation code for the test run
 *  3. Stores tokens + code in env vars for the test files
 */

const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';

export default async function globalSetup() {
  const adminEmail = process.env.E2E_ADMIN_EMAIL;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn(
      '\n⚠️  E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set.\n' +
        '   Tests that need admin seeding will be skipped.\n'
    );
    return;
  }

  // 1. Admin login
  const loginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });

  if (!loginRes.ok) {
    const body = await loginRes.text();
    throw new Error(`Admin login failed (${loginRes.status}): ${body}`);
  }

  const { accessToken } = await loginRes.json();
  process.env.E2E_ADMIN_TOKEN = accessToken;

  // 2. Create invitation code for test registration
  const invRes = await fetch(`${API_URL}/api/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      role: 'AZUBI',
      maxUses: 10,
    }),
  });

  if (!invRes.ok) {
    const body = await invRes.text();
    throw new Error(`Create invitation failed (${invRes.status}): ${body}`);
  }

  const invitation = await invRes.json();
  process.env.E2E_INVITATION_CODE = invitation.code;

  console.log(`✓ E2E setup: admin logged in, invitation code created (${invitation.code.slice(0, 4)}…)`);
}
