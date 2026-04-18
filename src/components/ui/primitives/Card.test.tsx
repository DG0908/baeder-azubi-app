import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

describe('Card', () => {
  it('rendert Children und Default-Padding', () => {
    const { container } = render(<Card>Inhalt</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveTextContent('Inhalt');
    expect(card.className).toMatch(/p-5/);
  });

  it('wendet padding="none" korrekt an', () => {
    const { container } = render(<Card padding="none">x</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toMatch(/\bp-3\b|\bp-5\b|\bp-8\b/);
  });

  it('rendert Header, Title und Content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Titel</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>
    );
    expect(screen.getByRole('heading', { name: 'Titel' })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});
