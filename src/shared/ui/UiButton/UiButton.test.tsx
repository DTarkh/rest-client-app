import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UiButton } from './UiButton';

describe('UiButton', () => {
  it('renders with correct text', () => {
    render(<UiButton>Click me</UiButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<UiButton onClick={handleClick}>Clickable button</UiButton>);

    const button = screen.getByRole('button', { name: 'Clickable button' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes for primary variant', () => {
    render(<UiButton variant='primary'>Primary Button</UiButton>);
    const button = screen.getByRole('button', { name: 'Primary Button' });

    expect(button).toHaveClass('bg-blue-500');
    expect(button).toHaveClass('text-white');
  });

  it('applies correct CSS classes for secondary variant', () => {
    render(<UiButton variant='secondary'>Secondary Button</UiButton>);
    const button = screen.getByRole('button', { name: 'Secondary Button' });

    expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-900');
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <UiButton onClick={handleClick} disabled>
        Disabled button
      </UiButton>,
    );

    const button = screen.getByRole('button', { name: 'Disabled button' });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('applies disabled class when disabled', () => {
    render(<UiButton disabled>Disabled button</UiButton>);
    const button = screen.getByRole('button', { name: 'Disabled button' });

    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });
});
