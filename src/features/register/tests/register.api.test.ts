import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signUpAPI } from '../api/register-api';

const signUp = vi.fn();
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({ auth: { signUp } }),
}));

beforeEach(() => signUp.mockReset());

describe('signUpAPI.signUp', () => {
  it('returns data on success', async () => {
    signUp.mockResolvedValueOnce({ data: { user: { id: '2' } }, error: null });
    const data = await signUpAPI.signUp({
      email: 'u@u.u',
      password: 'pass123',
      confirmPassword: 'pass123',
    });
    expect(data.user!.id).toBe('2');
  });

  it('maps known error message', async () => {
    signUp.mockResolvedValueOnce({ data: null, error: { message: 'User already registered' } });
    await expect(
      signUpAPI.signUp({ email: 'u@u.u', password: 'pass123', confirmPassword: 'pass123' }),
    ).rejects.toThrow('Пользователь уже зарегистрирован');
  });

  it('passes unknown error message', async () => {
    signUp.mockResolvedValueOnce({ data: null, error: { message: 'Weird' } });
    await expect(
      signUpAPI.signUp({ email: 'u@u.u', password: 'pass123', confirmPassword: 'pass123' }),
    ).rejects.toThrow('Weird');
  });
});
