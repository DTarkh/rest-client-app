import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { LoginFormData } from '../model/validation';

import { useSignIn } from '../model/use-sign-in';

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

// --- stub API used by the hook
const signInFn = vi.fn();
vi.mock('../api/sign-in', () => ({
  signInAPI: {
    signIn: (credentials: LoginFormData) => signInFn(credentials),
  },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient();
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
  pushMock.mockReset();
  signInFn.mockReset();
  mockToast.success.mockReset();
  mockToast.error.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useSignIn – success & failure flows', () => {
  it('on success: shows toast and redirects to "/"', async () => {
    signInFn.mockResolvedValueOnce({ user: { id: 'u1' } });

    const { result } = renderHook(() => useSignIn(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ email: 'john@example.com', password: 'secret123' });
    });

    expect(signInFn).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'secret123',
    });
    expect(mockToast.success).toHaveBeenCalledWith('Добро пожаловать!');
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('on failure: shows friendly error toast from API', async () => {
    signInFn.mockRejectedValueOnce(new Error('Неверные учетные данные'));

    const { result } = renderHook(() => useSignIn(), { wrapper });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ email: 'bad@example.com', password: 'oops' }),
      ).rejects.toThrow();
    });

    expect(mockToast.error).toHaveBeenCalledWith('Неверные учетные данные');
    expect(pushMock).not.toHaveBeenCalled();
  });
});
