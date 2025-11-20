import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useSignOut } from '../model/use-sign-out';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const { mockToast } = vi.hoisted(() => ({
  mockToast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock('sonner', () => ({ toast: mockToast }));

const signOutFn = vi.fn();
vi.mock('../api/sign-out', () => ({
  signOutAPI: { signOut: () => signOutFn() },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient();
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
  pushMock.mockReset();
  signOutFn.mockReset();
  mockToast.success.mockReset();
  mockToast.error.mockReset();
});

describe('useSignOut – success & failure flows', () => {
  it('on success: shows toast and redirects home', async () => {
    signOutFn.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useSignOut(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(signOutFn).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith('Вы вышли из системы');
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('on error: shows error toast and does not redirect', async () => {
    signOutFn.mockRejectedValueOnce(new Error('Ошибка при выходе из системы'));

    const { result } = renderHook(() => useSignOut(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync();
      } catch {
        // expected rethrow
      }
    });

    expect(mockToast.error).toHaveBeenCalledWith('Ошибка при выходе из системы');
    expect(pushMock).not.toHaveBeenCalled();
  });
});
