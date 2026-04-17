import { test, expect } from '@playwright/test';

/**
 * Flow 1: Registration
 *
 * Registers a new user with a valid invitation code, verifies the
 * success toast appears, and confirms the view switches back to login.
 *
 * Requires: E2E_INVITATION_CODE (set by global-setup via admin API)
 */
test.describe('Registration', () => {
  test('registers a new user with valid invitation code', async ({ page }) => {
    const invCode = process.env.E2E_INVITATION_CODE;
    test.skip(!invCode, 'E2E_INVITATION_CODE not available — skipping');

    const ts = Date.now().toString(36);
    const name = `E2E Tester ${ts}`;
    const email = `e2e-${ts}@test.local`;
    const password = 'Test1234!@#$secure';

    await page.goto('/');

    // Switch to register tab
    await page.click('button:has-text("Registrieren")');
    await expect(page.locator('input[placeholder="Einladungscode"]')).toBeVisible();

    // Fill registration form
    await page.fill('input[placeholder="Einladungscode"]', invCode!);

    // Wait for code validation (shows org name)
    await expect(
      page.locator('text=Registrierung als').first()
    ).toBeVisible({ timeout: 10_000 });

    await page.fill('input[placeholder="Vollständiger Name"]', name);
    await page.fill('input[placeholder="E-Mail"]', email);
    await page.fill('input[placeholder*="Passwort"]', password);

    // Check birthday field if present
    const birthdayInput = page.locator('input[type="date"]');
    if (await birthdayInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await birthdayInput.fill('2000-01-15');
    }

    // Submit
    await page.click('button[type="submit"]:has-text("Registrieren")');

    // Expect success toast
    await expect(
      page.locator('text=Registrierung erfolgreich').first()
    ).toBeVisible({ timeout: 10_000 });

    // Should be back on login form
    await expect(
      page.locator('input[placeholder="E-Mail oder Name"]')
    ).toBeVisible();

    // Store for later tests
    process.env.E2E_TEST_EMAIL = email;
    process.env.E2E_TEST_PASSWORD = password;
    process.env.E2E_TEST_NAME = name;
  });

  test('rejects registration with invalid invitation code', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Registrieren")');

    await page.fill('input[placeholder="Einladungscode"]', 'INVALIDCODE999');

    // Wait for validation — should show error or no org name
    await page.waitForTimeout(2000);

    // The code status should indicate invalid (red border or error text)
    const validIndicator = page.locator('text=Registrierung als');
    await expect(validIndicator).not.toBeVisible();
  });
});
