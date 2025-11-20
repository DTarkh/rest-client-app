import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { SignOutButton } from '../ui/SignOutButton';

const hookState = {
  mutate: vi.fn(),
  isPending: false,
};

vi.mock('../model/use-sign-out', () => ({
  useSignOut: () => hookState,
}));

vi.mock('../model/i18n', () => ({
  useI18n: () => ({
    t: (k: string) =>
      (({ logout: 'Sign out', loggingOut: 'Logging out…' }) as Record<string, string>)[k] ?? k,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  hookState.mutate.mockReset();
  hookState.isPending = false;
});

describe('SignOutButton – UI', () => {
  it('calls signOut on click', async () => {
    render(<SignOutButton />);
    const btn = screen.getByRole('button', { name: /sign out/i });

    await userEvent.click(btn);
    expect(hookState.mutate).toHaveBeenCalled();
  });

  it('disables button and shows "Logging out…" when pending', () => {
    hookState.isPending = true;

    render(<SignOutButton />);
    const btn = screen.getByRole('button', { name: /logging out/i });

    expect(btn).toBeDisabled();
  });
});
