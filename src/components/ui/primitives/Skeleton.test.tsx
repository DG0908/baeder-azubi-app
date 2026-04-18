import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('rendert mit role="status" und aria-label', () => {
    render(<Skeleton />);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-label', 'Wird geladen');
    expect(el.className).toMatch(/animate-pulse/);
  });

  it('wendet Variant-Klassen an', () => {
    const { rerender, container } = render(<Skeleton variant="circle" />);
    expect((container.firstChild as HTMLElement).className).toMatch(/rounded-full/);
    rerender(<Skeleton variant="text" />);
    expect((container.firstChild as HTMLElement).className).toMatch(/h-4/);
  });
});
