import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signOutAPI } from '../api/sign-out';

const signOut = vi.fn();
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({ auth: { signOut } }),
}));

beforeEach(() => signOut.mockReset());

describe('signOutAPI.signOut', () => {
  it('resolves on success', async () => {
    signOut.mockResolvedValueOnce({ error: null });
    await expect(signOutAPI.signOut()).resolves.toBeUndefined();
  });

  it('throws on error', async () => {
    signOut.mockResolvedValueOnce({ error: { message: 'err' } });
    await expect(signOutAPI.signOut()).rejects.toThrow('Ошибка при выходе из системы');
  });
});
