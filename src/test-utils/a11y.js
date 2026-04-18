import axe from 'axe-core';

/**
 * Läuft axe-core gegen einen gerenderten Container und wirft,
 * wenn kritische/serious a11y-Verletzungen gefunden werden.
 *
 * Nutze:
 *   const { container } = render(<MyComponent />);
 *   await expectNoA11yViolations(container);
 */
export async function expectNoA11yViolations(container, options = {}) {
  const result = await axe.run(container, {
    rules: {
      // Color contrast prüft axe in happy-dom unzuverlässig (keine echten Styles) → off
      'color-contrast': { enabled: false },
      ...options.rules
    }
  });

  const serious = result.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );

  if (serious.length > 0) {
    const summary = serious
      .map((v) => {
        const nodeSnippets = v.nodes
          .map((n) => `      → ${n.target.join(' ')}: ${n.html.slice(0, 120)}`)
          .join('\n');
        return `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))\n${nodeSnippets}`;
      })
      .join('\n');
    throw new Error(`Accessibility violations:\n${summary}`);
  }

  return result;
}
