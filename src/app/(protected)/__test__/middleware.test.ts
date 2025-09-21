import { beforeEach, describe, expect, it, vi } from 'vitest';

const { redirectMock, nextMock, getUserMock } = vi.hoisted(() => {
  return {
    redirectMock: vi.fn((url: any) => ({ type: 'redirect', url })),
    nextMock: vi.fn(() => ({ type: 'next' })),
    // Default: guest (no user)
    getUserMock: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  };
});

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: redirectMock,
    next: nextMock,
  },
}));

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createMiddlewareClient: () => ({
    auth: {
      getUser: getUserMock,
    },
  }),
}));

import { middleware } from '../../../middleware';

function makeReq(pathname: string, cookieMap: Record<string, string> = {}) {
  return {
    nextUrl: {
      pathname,
      search: '',
      clone() {
        return {
          pathname: this.pathname,
          search: this.search,
          toString() {
            return this.pathname + (this.search || '');
          },
        };
      },
    },
    cookies: {
      get(name: string) {
        return cookieMap[name] ? { name, value: cookieMap[name] } : undefined;
      },
    },
    headers: new Map(),
  } as unknown as Parameters<typeof middleware>[0];
}

async function run(mw: any, req: any) {
  const out = mw(req);
  return out instanceof Promise ? await out : out;
}

beforeEach(() => {
  redirectMock.mockClear();
  nextMock.mockClear();
  getUserMock.mockReset().mockResolvedValue({ data: { user: null }, error: null });
});

describe('middleware route protection', () => {
  it('redirects GUEST from protected route (/client)', async () => {
    const req = makeReq('/client'); // unauthenticated
    const res = await run(middleware, req);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    const [urlArg] = redirectMock.mock.calls[0];

    expect(urlArg.pathname).toBe('/login');
    expect(res).toEqual({ type: 'redirect', url: urlArg });
  });

  it('redirects GUEST from protected route (/variables)', async () => {
    const req = makeReq('/variables'); // unauthenticated
    const res = await run(middleware, req);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    const [urlArg] = redirectMock.mock.calls[0];

    expect(urlArg.pathname).toBe('/login');
    expect(res).toEqual({ type: 'redirect', url: urlArg });
  });

  it('allows AUTHED user to access protected route (/client)', async () => {
    // Simulate logged-in user
    getUserMock.mockResolvedValueOnce({ data: { user: { id: 'u1' } }, error: null });

    const req = makeReq('/client');
    const res = await run(middleware, req);

    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ type: 'next' });
  });
  it('allows AUTHED user to access protected route (/variables)', async () => {
    // Simulate logged-in user
    getUserMock.mockResolvedValueOnce({ data: { user: { id: 'u1' } }, error: null });

    const req = makeReq('/variables');
    const res = await run(middleware, req);

    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ type: 'next' });
  });

  it('passes through public route (/)', async () => {
    const req = makeReq('/');
    const res = await run(middleware, req);

    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ type: 'next' });
  });

  it('redirects AUTHED away from /login', async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: 'u1' } }, error: null });

    const req = makeReq('/login');
    await run(middleware, req);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    const [urlArg] = redirectMock.mock.calls[0];

    expect(urlArg.pathname).toBe('/');
  });

  it('redirects AUTHED away from /register', async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: 'u1' } }, error: null });

    const req = makeReq('/register');
    await run(middleware, req);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    const [urlArg] = redirectMock.mock.calls[0];

    expect(urlArg.pathname).toBe('/');
  });
});
