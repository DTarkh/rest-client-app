import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { I18nProvider } from '@/shared/lib/i18n';
import { useResponseStore } from '@/entities/http-response';
import { ResponseViewer } from '../ui/ResponseViewer';

describe('ResponseViewer', () => {
  beforeEach(() => {
    useResponseStore.getState().clearResponse();
  });

  const renderWithI18n = (ui: React.ReactElement) =>
    render(<I18nProvider lang='en'>{ui}</I18nProvider>);

  it('shows empty state initially', () => {
    renderWithI18n(<ResponseViewer />);
    expect(document.querySelector('[data-testid="response-empty"]')).toBeTruthy();
  });

  it('shows loading state', () => {
    useResponseStore.getState().setLoading(true);
    renderWithI18n(<ResponseViewer />);
    expect(document.querySelector('[data-testid="response-loading"]')).toBeTruthy();
  });

  it('renders success response with status and pretty JSON', () => {
    useResponseStore.getState().setResponse({
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      data: { hello: 'world' },
      size: 20,
      duration: 10,
      timestamp: Date.now(),
    });
    renderWithI18n(<ResponseViewer />);
    const status = document.querySelector('[data-testid="response-status"]');
    expect(status?.textContent).toBe('200');
    const body = document.querySelector('[data-testid="response-body"]')?.textContent || '';
    expect(body).toContain('hello');
    expect(body).toContain('\n'); // pretty format
  });

  it('renders http error with badge extracted from message', () => {
    useResponseStore.getState().setError('HTTP error 404: Not Found');
    renderWithI18n(<ResponseViewer />);
    const errorCard = document.querySelector('[data-testid="response-error"]');
    expect(errorCard).toBeTruthy();
    const status = document.querySelector('[data-testid="response-status"]');
    expect(status?.textContent).toBe('404');
  });
});
