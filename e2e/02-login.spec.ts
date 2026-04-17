import { test, expect } from '@playwright/test';

/**
 * Flow 2: Login (+ TOTP if enabled)
 *
 * Tests login with valid and invalid credentials.
 * If 2FA is enabled on the admin account, tests the TOTP input screen.
 *
 * Requires: E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD
 */
test.describe('Login', () => {
  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder="E-Mail oder Name"]', 'nobody@invalid.local');
    await page.fill('input[placeholder="Passwort"]', 'wrongpassword123');
    await page.click('button:has-text("Anmelden")');

    // Should show error toast
    await expect(
      page.locator('text=/falsch|Fehler|fehlgeschlagen/i').first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('logs in with valid admin credentials', async ({ page }) => {
    const email = process.env.E2E_ADMIN_EMAIL;
    const password = process.env.E2E_ADMIN_PASSWORD;
    test.skip(!email || !password, 'E2E_ADMIN_EMAIL/PASSWORD not set');

    await page.goto('/');

    await page.fill('input[placeholder="E-Mail oder Name"]', email!);
    await page.fill('input[placeholder="Passwort"]', password!);
    await page.click('button:has-text("Anmelden")');

    // Two possible outcomes: TOTP prompt or direct login
    const totpInput = page.locator('input[placeholder*="Code"], input[inputmode="numeric"]').first();
    const mainApp = page.locator('text=/Startseite|Willkommen|Dashboard/i').first();

    const result = await Promise.race([
      totpInput.waitFor({ state: 'visible', timeout: 10_000 }).then(() => 'totp' as const),
      mainApp.waitFor({ state: 'visible', timeout: 10_000 }).then(() => 'app' as const),
    ]);

    if (result === 'totp') {
      // TOTP screen is showing — verify it has the expected structure
      await expect(page.locator('text=/Zwei-Faktor|2FA|Authentifizierung/i').first()).toBeVisible();
      // We can't auto-generate TOTP codes, so just verify the screen is correct
      test.info().annotations.push({
        type: 'info',
        description: 'TOTP screen reached — cannot auto-fill code in E2E',
      });
    } else {
      // Direct login successful — main app is visible
      await expect(mainApp).toBeVisible();
    }
  });

  test('navigates to password reset', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Passwort vergessen');

    // Should show password reset form
    await expect(
      page.locator('input[placeholder="Deine E-Mail-Adresse"]')
    ).toBeVisible({ timeout: 5_000 });
  });

  test('shows not-approved error for pending user', async ({ page }) => {
    // Register a user that won't be approved
    const invCode = process.env.E2E_INVITATION_CODE;
    test.skip(!invCode, 'E2E_INVITATION_CODE not available');

    const ts = Date.now().toString(36);
    const email = `e2e-pending-${ts}@test.local`;
    const password = 'PendingTest1234!@#$';

    // Register via API
    const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';
    const regRes = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Pending User ${ts}`,
        email,
        password,
        invitationCode: invCode,
      }),
    });
    test.skip(!regRes.ok, `Registration failed: ${await regRes.text()}`);

    // Try to login — should fail with not_approved
    await page.goto('/');
    await page.fill('input[placeholder="E-Mail oder Name"]', email);
    await page.fill('input[placeholder="Passwort"]', password);
    await page.click('button:has-text("Anmelden")');

    await expect(
      page.locator('text=/nicht freigeschaltet|nicht genehmigt|Freigabe/i').first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
