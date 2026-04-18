import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('rendert Default-Variante als <button>', () => {
    render(<Button>Klick mich</Button>);
    const btn = screen.getByRole('button', { name: 'Klick mich' });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.className).toMatch(/bg-brand-500/);
  });

  it('wendet Variant- und Size-Klassen an', () => {
    render(
      <Button variant="danger" size="lg">
        Löschen
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'Löschen' });
    expect(btn.className).toMatch(/bg-danger-500/);
    expect(btn.className).toMatch(/h-12/);
  });

  it('feuert onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>OK</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('rendert bei asChild als übergebenes Element', () => {
    render(
      <Button asChild>
        <a href="/profil">Profil</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Profil' });
    expect(link).toHaveAttribute('href', '/profil');
    expect(link.className).toMatch(/bg-brand-500/);
  });

  it('respektiert disabled-Attribut', () => {
    render(<Button disabled>Off</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
