import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { I18nProvider } from '@/shared/lib/i18n';
import { useResponseStore } from '@/entities/http-response';
import { ResponseViewer } from '../ui/ResponseViewer';

const writeText = vi.fn();
Object.assign(navigator, { clipboard: { writeText } });
const revoke = vi.fn();
// mock URL methods
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.URL.createObjectURL = vi.fn(() => 'blob://test') as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.URL.revokeObjectURL = revoke as any;

const renderWithI18n = (ui: React.ReactElement) =>
  render(<I18nProvider lang='en'>{ui}</I18nProvider>);

describe('ResponseViewer extra', () => {
  beforeEach(() => {
    useResponseStore.getState().clearResponse();
    writeText.mockReset();
  });

  it('copies formatted body and triggers blob download', () => {
    useResponseStore.getState().setResponse({
      status: 201,
      statusText: 'Created',
      headers: { a: 'b' },
      data: { x: 1 },
      size: 50,
      duration: 5,
      timestamp: Date.now(),
    });

    const { getByTestId } = renderWithI18n(<ResponseViewer />);
    fireEvent.click(getByTestId('copy-response'));
    expect(writeText).toHaveBeenCalled();

    const dl = getByTestId('download-response');
    const createSpy = vi.spyOn(URL, 'createObjectURL');
    fireEvent.click(dl);
    expect(createSpy).toHaveBeenCalled();
  });
});
