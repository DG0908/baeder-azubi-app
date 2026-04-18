import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './Dialog';

describe('Dialog', () => {
  it('öffnet und schließt Dialog über Trigger/Close', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Öffnen</DialogTrigger>
        <DialogContent>
          <DialogTitle>Titel</DialogTitle>
          <DialogDescription>Beschreibung</DialogDescription>
          <DialogClose>Schließen</DialogClose>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Öffnen' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Titel')).toBeInTheDocument();
    expect(screen.getByText('Beschreibung')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Schließen' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
