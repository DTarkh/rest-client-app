import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActiveLink from '../active-link';
import React from 'react';

vi.mock('next/navigation', () => ({
  usePathname: () => '/app/client',
}));

describe('ActiveLink', () => {
  it('applies active styles when path matches', () => {
    render(<ActiveLink href='/app/client'>Client</ActiveLink>);
    const link = screen.getByRole('link', { name: /client/i });
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('does not apply active styles when path differs', () => {
    render(<ActiveLink href='/app/other'>Other</ActiveLink>);
    const link = screen.getByRole('link', { name: /other/i });
    expect(link).not.toHaveAttribute('aria-current');
  });
});
