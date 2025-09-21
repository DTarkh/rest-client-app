import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from '../ui/HomePage';
import { AppProvider } from '@/app/_/providers/AppProvider';
import { vi } from 'vitest';

vi.mock('@/widgets/app-header', () => ({
  AppHeader: () => <div data-testid='mock-header'>RestClient</div>,
}));
vi.mock('@/widgets/footer', () => ({
  Footer: () => <footer data-testid='mock-footer' />,
}));

describe('HomePage', () => {
  it('renders header brand and main section', () => {
    render(
      <AppProvider>
        <HomePage />
      </AppProvider>,
    );
    const matches = screen.getAllByText(/RestClient/);
    expect(matches.length).toBeGreaterThan(0);
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});
