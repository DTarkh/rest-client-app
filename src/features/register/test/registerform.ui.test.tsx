import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('../model/i18n', () => ({
  useI18n: () => ({
    t: (k: string) =>
      (
        ({
          title: 'Register',
          subtitle: 'Create your account',
          emailPlaceholder: 'Email',
          passwordPlaceholder: 'Password',
          confirmPasswordPlaceholder: 'Confirm password',
          registerButton: 'Register',
        }) as Record<string, string>
      )[k] ?? k,
  }),
}));

const hookState = {
  mutate: vi.fn<(data: { email: string; password: string; confirmPassword: string }) => void>(),
  isPending: false,
};

vi.mock('../model/use-sign-up', () => ({
  useSignUp: () => hookState,
}));

vi.mock('../model/use-sign-in', () => ({
  useSignUp: () => hookState,
}));

import { RegisterForm } from '../ui/RegisterForm';

beforeEach(() => {
  vi.clearAllMocks();
  hookState.mutate.mockReset();
  hookState.isPending = false;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('RegisterForm – UI submit', () => {
  it('submits valid data and calls useSignUp.mutate', async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByPlaceholderText(/email/i), 'new@user.dev');
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), 'Secret123!');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'Secret123!');

    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(hookState.mutate).toHaveBeenCalledWith({
      email: 'new@user.dev',
      password: 'Secret123!',
      confirmPassword: 'Secret123!',
    });
  });

  it('disables button when pending', async () => {
    hookState.isPending = true;

    render(<RegisterForm />);
    const btn = screen.getByRole('button', { name: /register/i });

    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(hookState.mutate).not.toHaveBeenCalled();
  });
});
