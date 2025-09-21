import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RegisterFormData } from '../model/validation';

import { useSignUp } from '../model/use-sign-up';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const { mockToast } = vi.hoisted(() => ({
  mockToast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock('sonner', () => ({ toast: mockToast }));

type SignUpResult = { user?: { id: string } } | undefined;
type SignUpFn = (data: RegisterFormData) => Promise<SignUpResult>;
const { signUpFn } = vi.hoisted(() => ({
  signUpFn: vi.fn<SignUpFn>(),
}));

vi.mock('../api/register-api', () => ({
  signUpAPI: {
    signUp: signUpFn,
  },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient();
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
  pushMock.mockReset();
  signUpFn.mockReset();
  mockToast.success.mockReset();
  mockToast.error.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useSignUp – success & failure flows', () => {
  it('on success: shows toast and redirects to /login', async () => {
    signUpFn.mockResolvedValueOnce({ user: { id: 'u1' } });

    const { result } = renderHook(() => useSignUp(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        email: 'new@example.com',
        password: 'Secret123!',
        confirmPassword: 'Secret123!',
      });
    });

    expect(signUpFn).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'Secret123!',
      confirmPassword: 'Secret123!',
    });
    expect(mockToast.success).toHaveBeenCalledWith(
      'Регистрация успешна! Проверьте email для подтверждения аккаунта',
    );
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('on failure: shows friendly error toast from API', async () => {
    signUpFn.mockRejectedValueOnce(new Error('Пользователь уже зарегистрирован'));

    const { result } = renderHook(() => useSignUp(), { wrapper });

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          email: 'duplicate@example.com',
          password: 'Secret123!',
          confirmPassword: 'Secret123!',
        }),
      ).rejects.toThrow();
    });

    expect(mockToast.error).toHaveBeenCalledWith('Пользователь уже зарегистрирован');
    expect(pushMock).not.toHaveBeenCalled();
  });
});
