import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signInAPI } from '../api/sign-in';

const signInWithPassword = vi.fn();
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({ auth: { signInWithPassword } }),
}));

beforeEach(() => {
  signInWithPassword.mockReset();
});

describe('signInAPI.signIn', () => {
  it('returns data on success', async () => {
    signInWithPassword.mockResolvedValueOnce({ data: { user: { id: '1' } }, error: null });
    const data = await signInAPI.signIn({ email: 'a@b.c', password: 'p' });
    expect(data.user.id).toBe('1');
  });

  it('maps known error message', async () => {
    signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid login credentials' },
    });
    await expect(signInAPI.signIn({ email: 'a@b.c', password: 'p' })).rejects.toThrow(
      'Неверные учетные данные',
    );
  });

  it('passes through unknown error message', async () => {
    signInWithPassword.mockResolvedValueOnce({ data: null, error: { message: 'Some other' } });
    await expect(signInAPI.signIn({ email: 'a@b.c', password: 'p' })).rejects.toThrow('Some other');
  });
});
