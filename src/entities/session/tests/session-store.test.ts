import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSessionStore } from '../model/session.store';

// Minimal supabase auth client mock
vi.mock('@supabase/auth-helpers-nextjs', () => {
  return {
    createClientComponentClient: () => ({
      auth: {
        getSession: vi.fn(async () => ({
          data: { session: { user: { id: 'u1' }, access_token: 't' } },
        })),
      },
    }),
  };
});

describe('session.store', () => {
  beforeEach(() => {
    useSessionStore.setState({ session: null, user: null, isLoading: true });
  });

  it('setSession sets user + session and clears loading', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useSessionStore.getState().setSession({ user: { id: '42' } } as any);
    const { session, user, isLoading } = useSessionStore.getState();
    expect(session?.user.id).toBe('42');
    expect(user?.id).toBe('42');
    expect(isLoading).toBe(false);
  });

  it('refresh fetches and updates store', async () => {
    await useSessionStore.getState().refresh();
    const { session, user, isLoading } = useSessionStore.getState();
    expect(session).not.toBeNull();
    expect(user?.id).toBe('u1');
    expect(isLoading).toBe(false);
  });

  it('clear resets state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useSessionStore.setState({
      session: { a: 1 } as any,
      user: { id: 'u' } as any,
      isLoading: false,
    });
    useSessionStore.getState().clear();
    const { session, user, isLoading } = useSessionStore.getState();
    expect(session).toBeNull();
    expect(user).toBeNull();
    expect(isLoading).toBe(false);
  });
});
