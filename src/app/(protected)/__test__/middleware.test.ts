import { beforeEach, describe, expect, it, vi } from 'vitest';

const { redirectMock, nextMock, getUserMock } = vi.hoisted(() => {
  type GetUserResult = { data: { user: { id: string } | null }; error: null };

  const redirectMock = vi.fn((url: URL) => ({ type: 'redirect' as const, url }));
  const nextMock = vi.fn(() => ({ type: 'next' as const }));

  const getUserMock = vi
    .fn<() => Promise<GetUserResult>>()
    .mockResolvedValue({ data: { user: null }, error: null });

  return { redirectMock, nextMock, getUserMock };
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

type MW = typeof middleware;
type MWReq = Parameters<MW>[0];
type MWRes = Awaited<ReturnType<MW>>;

function makeReq(pathname: string, cookieMap: Record<string, string> = {}): MWReq {
  const base = 'https://example.test';
  const full = new URL(pathname, base);

  const reqLike = {
    url: full.toString(),
    nextUrl: {
      pathname: full.pathname,
      search: full.search,
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
        const value = cookieMap[name];
        return value ? { name, value } : undefined;
      },
    },
    headers: new Map<string, string>(),
  } as unknown as MWReq;

  return reqLike;
}

async function run(mw: MW, req: MWReq): Promise<MWRes> {
  const out = mw(req);
  return out instanceof Promise ? await out : (out as MWRes);
}

beforeEach(() => {
  redirectMock.mockClear();
  nextMock.mockClear();
  getUserMock.mockReset().mockResolvedValue({ data: { user: null }, error: null });
});

describe('middleware route protection', () => {
  it('redirects GUEST from protected route (/client)', async () => {
    const req = makeReq('/client');
    const res = await run(middleware, req);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    const [urlArg] = redirectMock.mock.calls[0];
    expect(urlArg.pathname).toBe('/login');
    expect(res).toEqual({ type: 'redirect', url: urlArg });
  });

  it('redirects GUEST from protected route (/variables)', async () => {
    const req = makeReq('/variables');
    const res = await run(middleware, req);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    const [urlArg] = redirectMock.mock.calls[0];
    expect(urlArg.pathname).toBe('/login');
    expect(res).toEqual({ type: 'redirect', url: urlArg });
  });

  it('allows AUTHED user to access protected route (/client)', async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: 'u1' } }, error: null });

    const req = makeReq('/client');
    const res = await run(middleware, req);

    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ type: 'next' });
  });

  it('allows AUTHED user to access protected route (/variables)', async () => {
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
