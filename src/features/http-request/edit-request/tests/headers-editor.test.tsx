import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeadersEditor, type HeaderEntry } from '../ui/HeadersEditor';
import { AppProvider } from '@/app/_/providers/AppProvider';
import React from 'react';

function Wrapper() {
  const [headers, setHeaders] = React.useState<HeaderEntry[]>([]);
  const add = () =>
    setHeaders(h => [...h, { id: String(h.length + 1), key: '', value: '', enabled: true }]);
  const remove = (id: string) => setHeaders(h => h.filter(x => x.id !== id));
  const toggle = (id: string) =>
    setHeaders(h => h.map(x => (x.id === id ? { ...x, enabled: !x.enabled } : x)));
  return (
    <HeadersEditor
      headers={headers}
      onChange={setHeaders}
      onAdd={add}
      onRemove={remove}
      onToggle={toggle}
      validationErrors={{ 'header-1': 'headerValueRequired' }}
    />
  );
}

const renderWithProviders = () =>
  render(
    <AppProvider>
      <Wrapper />
    </AppProvider>,
  );

describe('HeadersEditor', () => {
  it('renders empty state then allows add/edit/toggle/remove', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    expect(screen.getByText(/No headers added|Заголовки не добавлены/)).toBeInTheDocument();

    await user.click(screen.getByTestId('add-header'));
    const list = screen.getByTestId('headers-list');
    const row = within(list).getByTestId('header-row');
    const keyInput = within(row).getByPlaceholderText(/Title|Название/);
    await user.type(keyInput, 'Content-Type');
    const valueInput = within(row).getByPlaceholderText(/Value|Значение/);
    await user.type(valueInput, 'application/json');

    // toggle disable
    const checkbox = within(row).getByRole('checkbox');
    await user.click(checkbox);
    await user.click(checkbox); // enable back

    // validation error message from provided map
    expect(
      within(row).getAllByText(
        /The header value cannot be empty|Значение заголовка не может быть пустым/,
      ).length,
    ).toBeGreaterThanOrEqual(0);

    // remove header
    await user.click(within(row).getByTestId('remove-header-1'));
    expect(screen.queryByTestId('header-row')).not.toBeInTheDocument();
  });
});
