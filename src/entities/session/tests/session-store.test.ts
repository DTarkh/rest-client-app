import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSessionStore } from '../model/session.store';
import type { Session, User } from '@supabase/supabase-js';

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
    const dummyUser = { id: '42' } as unknown as User;
    const dummySession = { user: dummyUser } as unknown as Session;
    useSessionStore.getState().setSession(dummySession);
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
    const dummyUser = { id: 'u' } as unknown as User;
    const dummySession = { user: dummyUser } as unknown as Session;
    useSessionStore.setState({ session: dummySession, user: dummyUser, isLoading: false });
    useSessionStore.getState().clear();
    const { session, user, isLoading } = useSessionStore.getState();
    expect(session).toBeNull();
    expect(user).toBeNull();
    expect(isLoading).toBe(false);
  });
});
