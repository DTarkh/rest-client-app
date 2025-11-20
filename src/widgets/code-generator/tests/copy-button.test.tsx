import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyButton } from '../ui/copy-button';

vi.mock('../model/i18n', () => ({
  useI18n: () => ({
    t: (k: string) =>
      ({
        copySuccess: 'Copied!',
        copyError: 'Copy error',
        copiedButton: 'Copied',
        copyButton: 'Copy',
      })[k] || k,
  }),
}));

const writeText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, { clipboard: { writeText } });

beforeEach(() => {
  writeText.mockClear();
});

describe('CopyButton', () => {
  it('changes label to Copied after click', async () => {
    const user = userEvent.setup();
    render(<CopyButton code='console.log(1);' language='js' />);
    const btn = screen.getByRole('button', { name: /copy/i });
    await user.click(btn);
    expect(await screen.findByText('Copied')).toBeInTheDocument();
  });

  it('disables when code is empty', () => {
    render(<CopyButton code='   ' language='js' />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
