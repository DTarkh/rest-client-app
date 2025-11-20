import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UpdateLang } from '../ui/updateLang';
import { useLang } from '@/entities/i18n';

// Ensure store resets between tests
beforeEach(() => {
  useLang.setState({
    isLoading: false,
    lang: 'en',
    loadLang: vi.fn(),
    setLang: useLang.getState().setLang,
  });
});

describe('UpdateLang', () => {
  it('renders current language and can switch to ru', () => {
    render(<UpdateLang />);
    // Rendered preview should show 'En'
    expect(screen.getByText('En')).toBeInTheDocument();

    // Open select
    fireEvent.click(screen.getByRole('button'));
    // Click Ru option
    fireEvent.click(screen.getByText('Ru'));

    // After change preview now shows Ru
    expect(screen.getByText('Ru')).toBeInTheDocument();
  });
});
