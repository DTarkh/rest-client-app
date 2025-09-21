import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { LoginForm } from '../ui/LoginForm';
import type { LoginFormData } from '../model/validation';

vi.mock('../model/i18n', () => ({
  useI18n: () => ({
    t: (k: string) =>
      (
        ({
          title: 'Sign in',
          subtitle: 'Welcome back',
          emailPlaceholder: 'Email',
          passwordPlaceholder: 'Password',
          loginButton: 'Sign in',
        }) as Record<string, string>
      )[k] ?? k,
  }),
}));

const createMutateMock = () => vi.fn<(data: LoginFormData) => Promise<void>>();

const hookState: {
  isPending: boolean;
  mutateAsync: ReturnType<typeof createMutateMock>;
} = {
  isPending: false,
  mutateAsync: createMutateMock(),
};

vi.mock('../model/use-sign-in', () => ({
  useSignIn: () => hookState,
}));

beforeEach(() => {
  hookState.isPending = false;
  hookState.mutateAsync = createMutateMock();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('LoginForm – UI submit -> calls sign in hook', () => {
  it('submits valid data: calls mutateAsync(email, password)', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByPlaceholderText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'Secret123!');

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(hookState.mutateAsync).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'Secret123!',
      }),
    );
  });

  it('disables button when hook reports pending', async () => {
    hookState.isPending = true;

    render(<LoginForm />);

    const btn = screen.getByRole('button', { name: /sign in/i });
    expect(btn).toBeDisabled();

    await userEvent.click(btn);
    expect(hookState.mutateAsync).not.toHaveBeenCalled();
  });
});
