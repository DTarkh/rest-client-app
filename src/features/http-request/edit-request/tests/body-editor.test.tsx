import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { BodyEditor } from '../ui/BodyEditor';
import { AppProvider } from '@/app/_/providers/AppProvider';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('BodyEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders body-not-allowed for GET method', () => {
    renderWithProviders(<BodyEditor body='' bodyType='none' method='GET' onChange={vi.fn()} />);
    expect(screen.getByTestId('body-not-allowed')).toBeInTheDocument();
  });

  it('switches tabs and calls onChange with new type', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<BodyEditor body='' bodyType='none' method='POST' onChange={onChange} />);

    // default: none panel
    expect(screen.getByTestId('panel-none')).toBeInTheDocument();

    await user.click(screen.getByTestId('tab-json'));
    expect(onChange).toHaveBeenLastCalledWith('', 'json');
    expect(screen.getByTestId('panel-json')).toBeInTheDocument();

    await user.click(screen.getByTestId('tab-text'));
    expect(onChange).toHaveBeenLastCalledWith('', 'text');
    expect(screen.getByTestId('panel-text')).toBeInTheDocument();

    await user.click(screen.getByTestId('tab-none'));
    expect(onChange).toHaveBeenLastCalledWith('', 'none');
  });

  it('formats valid JSON when clicking prettify button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const rawJson = '{"a":1}';
    renderWithProviders(
      <BodyEditor body={rawJson} bodyType='json' method='POST' onChange={onChange} />,
    );

    const prettifyBtn = screen.getByTestId('prettify-json');
    await user.click(prettifyBtn);
    const ta = screen.getByTestId('json-body-textarea') as HTMLTextAreaElement;
    expect(ta.value).toMatch(/\n {2}"a": 1\n/);
  });

  it('shows invalid JSON error badge', () => {
    renderWithProviders(
      <BodyEditor body='{bad' bodyType='json' method='POST' onChange={vi.fn()} />,
    );
    // Badge destructive appears
    expect(
      screen.getAllByText(/Incorrect JSON format|Неверный формат JSON/).length,
    ).toBeGreaterThan(0);
  });

  it('edits text body and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <BodyEditor body='hello' bodyType='text' method='POST' onChange={onChange} />,
    );
    const textarea = screen.getByTestId('text-body-textarea') as HTMLTextAreaElement;
    await user.clear(textarea);
    await user.type(textarea, 'world');
    // last call includes final string
    expect(onChange).toHaveBeenLastCalledWith('world', 'text');
  });
});
