import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SessionAPI } from '../api/session-api';
import { useSessionStore } from '../model/session.store';
import type { Session, User } from '@supabase/supabase-js';

const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
    },
  }),
}));

describe('SessionAPI', () => {
  beforeEach(() => {
    useSessionStore.setState({ session: null, user: null, isLoading: true });
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
  });

  it('initializeSession sets store when session exists', async () => {
    getSessionMock.mockResolvedValueOnce({ data: { session: { user: { id: 'abc' } } } });
    await SessionAPI.initializeSession();
    const { user, session, isLoading } = useSessionStore.getState();
    expect(user?.id).toBe('abc');
    expect(session).not.toBeNull();
    expect(isLoading).toBe(false);
  });

  it('initializeSession clears store when no session', async () => {
    const dummyUser = { id: 'x' } as unknown as User;
    const dummySession = { user: dummyUser } as unknown as Session;
    useSessionStore.setState({ session: dummySession, user: dummyUser, isLoading: true });
    getSessionMock.mockResolvedValueOnce({ data: { session: null } });
    await SessionAPI.initializeSession();
    const { user, session } = useSessionStore.getState();
    expect(user).toBeNull();
    expect(session).toBeNull();
  });

  it('initializeSession clears store on error', async () => {
    const dummyUser = { id: 'x' } as unknown as User;
    const dummySession = { user: dummyUser } as unknown as Session;
    useSessionStore.setState({ session: dummySession, user: dummyUser, isLoading: true });
    getSessionMock.mockRejectedValueOnce(new Error('boom'));
    await SessionAPI.initializeSession();
    const { user, session } = useSessionStore.getState();
    expect(user).toBeNull();
    expect(session).toBeNull();
  });

  it('subscribeToAuthChanges handles session change', () => {
    const unSubMock = vi.fn();
    onAuthStateChangeMock.mockImplementation(cb => {
      cb('SIGNED_IN', { user: { id: 'user1' } });
      cb('SIGNED_OUT', null);
      return unSubMock;
    });

    const sub = SessionAPI.subscribeToAuthChanges();
    expect(typeof sub).toBe('function');
    expect(useSessionStore.getState().user).toBeNull();
  });
});
