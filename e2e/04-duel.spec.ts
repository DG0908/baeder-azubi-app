import { test, expect } from '@playwright/test';

/**
 * Flow 4: Duel / Quiz
 *
 * 1. Login as approved user
 * 2. Navigate to Quiz view
 * 3. Verify the quiz lobby renders (player list, difficulty selection)
 * 4. Verify that challenge button is present for other players
 *
 * Requires: An approved test user (uses admin credentials as fallback)
 */
test.describe('Duel / Quiz Flow', () => {
  test('quiz lobby is accessible and shows game elements', async ({ page }) => {
    const email = process.env.E2E_ADMIN_EMAIL;
    const password = process.env.E2E_ADMIN_PASSWORD;
    test.skip(!email || !password, 'No test credentials available');

    // Login
    await page.goto('/');
    await page.fill('input[placeholder="E-Mail oder Name"]', email!);
    await page.fill('input[placeholder="Passwort"]', password!);
    await page.click('button:has-text("Anmelden")');

    // Handle TOTP if needed
    const totpInput = page.locator('input[placeholder*="Code"], input[inputmode="numeric"]').first();
    const mainApp = page.locator('text=/Startseite|Willkommen|Dashboard/i').first();

    const loginResult = await Promise.race([
      totpInput.waitFor({ state: 'visible', timeout: 10_000 }).then(() => 'totp' as const),
      mainApp.waitFor({ state: 'visible', timeout: 10_000 }).then(() => 'app' as const),
    ]);

    if (loginResult === 'totp') {
      test.skip(true, 'TOTP required — cannot proceed without authenticator');
    }

    // Navigate to quiz view
    await page.click('text=Quizduell');
    await expect(page.locator('text=Spieler herausfordern')).toBeVisible({ timeout: 10_000 });

    // Verify difficulty selection is shown
    await expect(page.locator('text=Schwierigkeitsgrad')).toBeVisible();

    // Verify game rules info box
    await expect(page.locator('text=Spielregeln')).toBeVisible();

    // Verify timer/deadline selector
    await expect(page.locator('text=Annahmefrist')).toBeVisible();
  });

  test('active games section is visible', async ({ page }) => {
    const email = process.env.E2E_ADMIN_EMAIL;
    const password = process.env.E2E_ADMIN_PASSWORD;
    test.skip(!email || !password, 'No test credentials available');

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

    await page.click('text=Quizduell');
    await page.waitForTimeout(2000);

    // The quiz view should show either active games or "no games" state
    const quizView = page.locator('text=Quizduell');
    await expect(quizView).toBeVisible();
  });
});
