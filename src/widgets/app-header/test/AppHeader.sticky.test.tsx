import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

function isWithPathname(x: unknown): x is { pathname?: string } {
  return typeof x === 'object' && x !== null && 'pathname' in (x as Record<string, unknown>);
}
function resolveHref(href: unknown): string {
  if (typeof href === 'string') return href;
  if (href instanceof URL) return href.toString();
  if (isWithPathname(href)) return href.pathname ?? '/';
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
        {children}
      </a>
    );
  }
  return { default: Link };
});

vi.mock('@/src/features/i18n', () => ({
  UpdateLang: () => <div data-testid='update-lang' />,
}));

vi.mock('../model/i18n', () => ({
  useI18n: () => ({ t: (k: string) => k }),
}));

vi.mock('@/src/entities/session', () => ({
  useSessionStore: () => ({ isLoading: false, user: null }),
}));

vi.mock('@/src/features/sign-out', () => ({
  SignOutButton: () => <button data-testid='signout'>signout</button>,
}));

vi.mock('@/src/shared/constants', () => ({
  routes: {
    home: '/',
    client: '/client',
    login: '/login',
    register: '/register',
  },
}));

import { AppHeader } from '../ui/AppHeader';

function setScrollY(y: number) {
  (window as unknown as { scrollY: number }).scrollY = y;
}

beforeEach(() => {
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
});

describe('AppHeader sticky behavior', () => {
  it('uses transparent styles initially and toggles sticky styles after scroll', async () => {
    render(<AppHeader />);
    const header = screen.getByRole('banner');

    // Initially transparent
    expect(header.className).toContain('bg-transparent');
    expect(header.className).not.toContain('bg-white/90');

    // Trigger scroll change within act and wait for update
    await act(async () => {
      setScrollY(100);
      window.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      expect(header.className).toContain('bg-white/90');
      expect(header.className).toContain('backdrop-blur-md');
      expect(header.className).toContain('shadow-lg');
      expect(header.className).toContain('border-b');
    });

    // Back to top
    await act(async () => {
      setScrollY(0);
      window.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      expect(header.className).toContain('bg-transparent');
      expect(header.className).not.toContain('bg-white/90');
    });
  });

  it('applies sticky styles when mobile menu is opened (even without scroll)', () => {
    render(<AppHeader />);
    const header = screen.getByRole('banner');

    expect(header.className).toContain('bg-transparent');

    const toggle = screen.getByRole('button'); // mobile menu toggle
    fireEvent.click(toggle);

    expect(header.className).toContain('bg-white/90');
    expect(header.className).toContain('shadow-lg');

    fireEvent.click(toggle);
    expect(header.className).toContain('bg-transparent');
  });
});
