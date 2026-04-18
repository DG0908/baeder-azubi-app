import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Flow 6: Accessibility smoke-check
 *
 * Läuft axe-core gegen die Login-Landingpage. Wirft bei critical/serious Violations.
 * Keine Auth-Credentials nötig — prüft nur öffentlich sichtbare Seiten.
 */
test.describe('A11y smoke', () => {
  test('login page has no critical/serious a11y violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[placeholder="E-Mail oder Name"]');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (blocking.length > 0) {
      const summary = blocking
        .map((v) => `[${v.impact}] ${v.id}: ${v.help}\n  Nodes: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
        .join('\n');
      console.log('A11y violations:\n' + summary);
    }

    expect(blocking, 'critical/serious a11y violations on login page').toEqual([]);
  });
});
