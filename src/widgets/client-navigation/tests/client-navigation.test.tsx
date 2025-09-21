import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ClientNavigation } from '../ui/ClientNavigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/link', () => ({ default: (p: any) => <a {...p} /> }));
vi.mock('next/navigation', () => ({ usePathname: () => '/app/client' }));
vi.mock('@/features/i18n', () => ({ UpdateLang: () => <div>Lang</div> }));
vi.mock('../model/i18n', () => ({
  useI18n: () => ({ t: (k: string) => ({ client: 'Client', variables: 'Variables' })[k] || k }),
}));

describe('ClientNavigation', () => {
  it('renders desktop nav with client link', () => {
    render(<ClientNavigation />);
    expect(screen.getByText('RestClient')).toBeInTheDocument();
    const clientLinks = screen.getAllByText(/⚡\s*Client/i);
    expect(clientLinks.length).toBeGreaterThan(0);
  });

  it('toggles mobile menu with button clicks', () => {
    render(<ClientNavigation />);
    const btn = screen.getByRole('button');
    // open
    fireEvent.click(btn);
    const openCount = screen.getAllByText(/⚡\s*Client/i).length;
    expect(openCount).toBeGreaterThan(0);
    // close
    fireEvent.click(btn);
  });
});
