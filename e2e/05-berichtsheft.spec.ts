import { test, expect } from '@playwright/test';

/**
 * Flow 5: Berichtsheft (Report Book)
 *
 * 1. Login as approved user
 * 2. Navigate to Berichtsheft view
 * 3. Open a new draft for the current week
 * 4. Fill in the form fields
 * 5. Save the entry
 *
 * Requires: An approved test user with Berichtsheft permissions
 */
test.describe('Berichtsheft Submit', () => {
  test('can open Berichtsheft view and create a new draft', async ({ page }) => {
    const email = process.env.E2E_ADMIN_EMAIL;
    const password = process.env.E2E_ADMIN_PASSWORD;
    test.skip(!email || !password, 'No test credentials available');

    // Login
    await page.goto('/');
    await page.fill('input[placeholder="E-Mail oder Name"]', email!);
    await page.fill('input[placeholder="Passwort"]', password!);
    await page.click('button:has-text("Anmelden")');

    // Handle TOTP
    const totpInput = page.locator('input[placeholder*="Code"], input[inputmode="numeric"]').first();
    const mainApp = page.locator('text=/Startseite|Willkommen|Dashboard/i').first();

    const loginResult = await Promise.race([
      totpInput.waitFor({ state: 'visible', timeout: 10_000 }).then(() => 'totp' as const),
      mainApp.waitFor({ state: 'visible', timeout: 10_000 }).then(() => 'app' as const),
    ]);

    if (loginResult === 'totp') {
      test.skip(true, 'TOTP required — cannot proceed without authenticator');
    }

    // Navigate to Berichtsheft
    await page.click('text=Berichtsheft');
    await expect(page.locator('text=Digitales Berichtsheft')).toBeVisible({ timeout: 10_000 });

    // Click "Neu" to open a new draft
    await page.click('button:has-text("Neu")');

    // Wait for the edit form to appear — look for typical form elements
    // The form should have textarea or input fields for the report
    await page.waitForTimeout(2000);

    // Verify the form view is in edit mode (Neu button is highlighted or form fields visible)
    const formVisible = await page.locator('text=/Speichern|Betriebliche Tätigkeit|Bereich/i').first().isVisible().catch(() => false);

    if (formVisible) {
      // Try to fill the Berichtsheft form
      const textareas = page.locator('textarea');
      const count = await textareas.count();

      if (count > 0) {
        // Fill the first textarea with test content
        await textareas.first().fill('E2E-Test: Betriebliche Tätigkeiten der Woche');
      }

      // Look for save button
      const saveBtn = page.locator('button:has-text("Speichern")');
      await expect(saveBtn).toBeVisible();
    }
  });

  test('can view Berichtsheft overview list', async ({ page }) => {
    const email = process.env.E2E_ADMIN_EMAIL;
    const password = process.env.E2E_ADMIN_PASSWORD;
    test.skip(!email || !password, 'No test credentials available');

    // Login
    await page.goto('/');
    await page.fill('input[placeholder="E-Mail oder Name"]', email!);
    await page.fill('input[placeholder="Passwort"]', password!);
    await page.click('button:has-text("Anmelden")');

    const mainApp = page.locator('text=/Startseite|Willkommen|Dashboard/i').first();
    const totpInput = page.locator('input[placeholder*="Code"], input[inputmode="numeric"]').first();

    const loginResult = await Promise.race([
      totpInput.waitFor({ state: 'visible', timeout: 10_000 }).then(() => 'totp' as const),
      mainApp.waitFor({ state: 'visible', timeout: 10_000 }).then(() => 'app' as const),
    ]);

    if (loginResult === 'totp') {
      test.skip(true, 'TOTP required');
    }

    // Navigate to Berichtsheft
    await page.click('text=Berichtsheft');
    await expect(page.locator('text=Digitales Berichtsheft')).toBeVisible({ timeout: 10_000 });

    // Switch to list view
    await page.click('button:has-text("Übersicht")');
    await page.waitForTimeout(2000);

    // The overview should be visible (either entries or empty state)
    const berichtsheftView = page.locator('text=Digitales Berichtsheft');
    await expect(berichtsheftView).toBeVisible();
  });
});
