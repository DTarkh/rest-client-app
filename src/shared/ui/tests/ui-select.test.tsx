import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UiSelect } from '../lang-select';

type Opt = { id: string; label: string };

const options: Opt[] = [
  { id: 'en', label: 'EN' },
  { id: 'ru', label: 'RU' },
  { id: 'de', label: 'DE' },
];

describe.skip('UiSelect', () => {
  it('opens, keyboard navigates and selects option, closes on outside click & escape', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <div>
        <UiSelect
          options={options}
          value={options[0]}
          onChange={handleChange}
          getLabel={o => o.label}
        />
        <div data-testid='outside'>outside</div>
      </div>,
    );

    const btn = screen.getByRole('button');
    await user.click(btn);
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();

    // Arrow down twice then enter (should select option[2])
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(handleChange).toHaveBeenLastCalledWith(options[2]);

    // reopen and test escape
    await user.click(btn);
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    // reopen and outside click closes
    await user.click(btn);
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
