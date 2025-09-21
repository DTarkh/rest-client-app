import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VariableCard } from '../ui/VariableCard';
import { toast } from 'sonner';
import type { Variable } from '@/entities/variable';
import { AppProvider } from '@/app/_/providers/AppProvider';

const variable: Variable = {
  id: '1',
  name: 'TOKEN',
  value: 'secret-value',
  description: 'Test variable',
  isSecret: true,
  createdAt: Date.now() - 10000,
  updatedAt: Date.now(),
};

describe('VariableCard', () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  let confirmSpy: ((...args: unknown[]) => boolean) | undefined;

  beforeEach(() => {
    onEdit.mockReset();
    onDelete.mockReset();
    (global as unknown as { confirm: () => boolean }).confirm = vi.fn(() => true);
    confirmSpy = (global as unknown as { confirm: () => boolean }).confirm;
  });

  it('toggles secret value and performs copy & delete operations', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <VariableCard variable={variable} onEdit={onEdit} onDelete={onDelete} />
      </AppProvider>,
    );

    const masked = screen.getByTestId('variable-value');
    expect(masked.textContent).not.toContain('secret-value');

    await user.click(screen.getByTestId('toggle-secret'));
    expect(screen.getByTestId('variable-value').textContent).toContain('secret-value');

    await user.click(screen.getByTestId('copy-variable-name'));
    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));

    await user.click(screen.getByTestId('copy-variable-value'));
    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(2));

    await user.click(screen.getByTestId('edit-variable'));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ name: 'TOKEN' }));

    await user.click(screen.getByTestId('delete-variable'));
    expect(confirmSpy).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
