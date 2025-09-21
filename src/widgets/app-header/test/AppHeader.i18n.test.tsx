import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React, { ReactNode } from 'react';

import type { AnchorHTMLAttributes } from 'react';

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

function isWithPathname(x: unknown): x is { pathname?: string } {
  return typeof x === 'object' && x !== null && 'pathname' in (x as Record<string, unknown>);
}

function resolveHref(href: unknown): string {
  if (typeof href === 'string') return href;
  if (href instanceof URL) return href.toString();
  if (isWithPathname(href) && typeof href.pathname === 'string') return href.pathname || '/';
  return '/';
}

vi.mock('next/link', () => {
  function Link({
    href,
    className,
    children,
    ...rest
  }: React.PropsWithChildren<{ href: unknown; className?: string } & AnchorProps>) {
    const resolved = resolveHref(href);
    return (
      <a href={resolved} className={className} {...rest}>
        {children as ReactNode}
      </a>
    );
  }
  return { default: Link };
});

vi.mock('@/src/features/sign-out', () => ({
  SignOutButton: () => <button>signout</button>,
}));
vi.mock('@/src/entities/session', () => ({
  useSessionStore: () => ({ isLoading: false, user: null }),
}));
vi.mock('@/src/shared/constants', () => ({
  routes: { home: '/', client: '/client', login: '/login', register: '/register' },
}));

function mockI18n(dict: Record<string, string>) {
  vi.doMock('../model/i18n', () => ({
    useI18n: () => ({ t: (k: string) => dict[k] ?? k }),
  }));
  vi.doMock('@/src/features/i18n', () => ({
    UpdateLang: () => <button data-testid='lang-toggle'>lang</button>,
  }));
}

beforeEach(() => {
  cleanup();
  vi.resetModules();
});

describe('AppHeader i18n labels', () => {
  it('renders English labels', async () => {
    mockI18n({
      signIn: 'Sign In',
      register: 'Register',
      button: 'REST Client',
      welcome: 'Welcome',
    });

    const { AppHeader } = await import('../ui/AppHeader'); // import AFTER mocks
    render(<AppHeader />);

    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'REST Client' })).toBeInTheDocument();
  });

  it('renders Russian labels', async () => {
    mockI18n({
      signIn: 'Войти',
      register: 'Регистрация',
      button: 'Клиент',
      welcome: 'Добро пожаловать',
    });

    const { AppHeader } = await import('../ui/AppHeader');
    render(<AppHeader />);

    expect(screen.getByRole('link', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Регистрация' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Клиент' })).toBeInTheDocument();
  });
});
