import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useExecuteRequest } from '../model/use-execute-request';
import { useResponseStore } from '../../../../entities/http-response';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// MSW handlers
const successPayload = {
  status: 200,
  statusText: 'OK',
  headers: { 'content-type': 'application/json' },
  data: { ok: true },
  size: 15,
  duration: 25,
  timestamp: Date.now(),
};

const errorPayload = {
  status: 404,
  statusText: 'Not Found',
  headers: { 'content-type': 'application/json' },
  data: { message: 'Missing' },
  size: 20,
  duration: 12,
  timestamp: Date.now(),
};

const server = setupServer(
  http.post('/api/requests/execute', async ({ request }) => {
    const body = (await request.json()) as { url?: string };
    if (body.url === 'https://error.example') {
      return HttpResponse.json(errorPayload, { status: 200 });
    }
    if (body.url === 'https://network.example') {
      return new HttpResponse(null, { status: 500 });
    }
    return HttpResponse.json(successPayload, { status: 200 });
  }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
beforeEach(() => server.resetHandlers());

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient();
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('useExecuteRequest', () => {
  beforeEach(() => {
    // reset store state
    useResponseStore.getState().clearResponse();
  });

  it('handles success (200) and stores response', async () => {
    const { result } = renderHook(() => useExecuteRequest(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({
        method: 'GET',
        url: 'https://ok.example',
        headers: {},
      });
    });
    const state = useResponseStore.getState();
    expect(state.response?.status).toBe(200);
    expect(state.error).toBeNull();
  });

  it('handles http error (status >=400) sets error in store', async () => {
    const { result } = renderHook(() => useExecuteRequest(), { wrapper });
    await act(async () => {
      try {
        await result.current.mutateAsync({
          method: 'GET',
          url: 'https://error.example',
          headers: {},
        });
      } catch {
        // expected http error
      }
    });
    const state = useResponseStore.getState();
    expect(state.response).toBeNull();
    expect(state.error).toBeTruthy();
  });

  it('handles network/server failure', async () => {
    // Перехватываем и симулируем бросок fetch
    const originalFetch = global.fetch;
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.reject(new Error('Network failure')));
    const { result } = renderHook(() => useExecuteRequest(), { wrapper });
    await act(async () => {
      try {
        await result.current.mutateAsync({
          method: 'POST',
          url: 'https://network.example',
          headers: {},
        });
      } catch {
        // expected network error
      }
    });
    const state = useResponseStore.getState();
    expect(state.response).toBeNull();
    expect(state.error).toContain('Network failure');
    global.fetch = originalFetch;
  });
});
