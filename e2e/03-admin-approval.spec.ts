import { test, expect } from '@playwright/test';

/**
 * Flow 3: Admin Approval
 *
 * 1. Registers a new user (pending)
 * 2. Admin approves via API
 * 3. User can now log in and see the main app
 *
 * Requires: E2E_ADMIN_TOKEN, E2E_INVITATION_CODE
 */
test.describe('Admin Approval Flow', () => {
  test('approved user can login after admin approval', async ({ page }) => {
    const adminToken = process.env.E2E_ADMIN_TOKEN;
    const invCode = process.env.E2E_INVITATION_CODE;
    test.skip(!adminToken || !invCode, 'Admin token or invitation code not available');

    const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';
    const ts = Date.now().toString(36);
    const email = `e2e-approve-${ts}@test.local`;
    const password = 'ApproveTest1234!@#$';
    const name = `Approve User ${ts}`;

    // 1. Register new user via API
    const regRes = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, invitationCode: invCode }),
    });
    expect(regRes.ok).toBe(true);

    // 2. Get pending users and find our user
    const pendingRes = await fetch(`${API_URL}/api/users/pending`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(pendingRes.ok).toBe(true);
    const pendingUsers = await pendingRes.json();
    const pendingUser = pendingUsers.find(
      (u: { email: string }) => u.email === email
    );
    expect(pendingUser).toBeTruthy();

    // 3. Approve the user
    const approveRes = await fetch(
      `${API_URL}/api/users/${pendingUser.id}/approval`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ approved: true }),
      }
    );
    expect(approveRes.ok).toBe(true);

    // 4. Now login via UI — should succeed
    await page.goto('/');
    await page.fill('input[placeholder="E-Mail oder Name"]', email);
    await page.fill('input[placeholder="Passwort"]', password);
    await page.click('button:has-text("Anmelden")');

    // Should reach main app
    await expect(
      page.locator('text=/Startseite|Willkommen|Dashboard/i').first()
    ).toBeVisible({ timeout: 15_000 });
  });
});
