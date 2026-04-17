import { type Page, expect } from '@playwright/test';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';

/** Generate a unique test email to avoid collisions between runs */
export function testEmail(prefix = 'e2e') {
  const ts = Date.now().toString(36);
  return `${prefix}-${ts}@test.local`;
}

/** Register a user via API and return credentials + tokens */
export async function apiRegister(data: {
  name: string;
  email: string;
  password: string;
  invitationCode: string;
}) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Register failed (${res.status}): ${body}`);
  }
  return res.json();
}

/** Login via API and return tokens */
export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Login failed (${res.status}): ${body}`);
  }
  return res.json();
}

/** Approve a pending user via admin API */
export async function apiApproveUser(
  adminToken: string,
  userId: string,
) {
  const res = await fetch(`${API_URL}/api/users/${userId}/approval`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ approved: true }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Approve failed (${res.status}): ${body}`);
  }
  return res.json();
}

/** Get pending users list via admin API */
export async function apiGetPendingUsers(adminToken: string) {
  const res = await fetch(`${API_URL}/api/users/pending`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Get pending failed (${res.status}): ${body}`);
  }
  return res.json();
}

/** Login via the UI (fills form and submits) */
export async function uiLogin(page: Page, emailOrName: string, password: string) {
  // Make sure we're on the login view
  await page.goto('/');
  // Wait for login form
  await page.waitForSelector('input[placeholder="E-Mail oder Name"]', { timeout: 10_000 });
  await page.fill('input[placeholder="E-Mail oder Name"]', emailOrName);
  await page.fill('input[placeholder="Passwort"]', password);
  await page.click('button:has-text("Anmelden")');
}

/** Wait for the main app to be loaded (past the login screen) */
export async function waitForAppLoaded(page: Page) {
  // The app shows the main navigation after login
  await expect(page.locator('text=Startseite').first()).toBeVisible({ timeout: 15_000 });
}
