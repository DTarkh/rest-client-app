import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RequestBuilder } from '../ui/RequestBuilder';
/* eslint-disable boundaries/entry-point, boundaries/element-types */
import { AppProvider } from '@/src/app/_/providers/AppProvider';
import TanstackQueryProvider from '@/src/app/_/providers/TanstackQueryProvider';
import { useRequestStore } from '@/src/entities/http-request';

const UUID =
  '00000000-0000-4000-8000-000000000000' as `${string}-${string}-${string}-${string}-${string}`;

function ensureCryptoMock() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(UUID);
    return;
  }

  const mockRandomUUID: () => `${string}-${string}-${string}-${string}-${string}` = () => UUID;

  const mockCrypto: Crypto = {
    getRandomValues<T extends ArrayBufferView>(array: T): T {
      return array;
    },
    randomUUID: vi.fn(mockRandomUUID),
    subtle: {} as SubtleCrypto,
  };

  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: mockCrypto,
  });
}

ensureCryptoMock();

const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

beforeEach(() => {
  replaceMock.mockReset();

  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  if (globalThis.crypto && 'randomUUID' in globalThis.crypto) {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(UUID);
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('RequestBuilder – method selection & encoded route', () => {
  it('reflects selected method (POST) in encoded route on submit (via store)', async () => {
    const user = userEvent.setup();

    render(
      <TanstackQueryProvider>
        <AppProvider>
          <RequestBuilder />
        </AppProvider>
      </TanstackQueryProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    act(() => {
      useRequestStore.getState().setMethod('POST');
    });

    const endpoint = 'https://example.test/posts/1';
    const urlInput =
      screen.queryByPlaceholderText(/Endpoint URL/i) ??
      screen.getByPlaceholderText(/jsonplaceholder|http/i);
    await user.clear(urlInput);
    await user.type(urlInput, endpoint);

    const sendBtn = screen.getByRole('button', { name: /send/i });
    await user.click(sendBtn);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledTimes(1));

    const [[pushedUrl]] = replaceMock.mock.calls;
    const urlStr = String(pushedUrl);

    expect(urlStr).toMatch(/^\/client\/POST\/[A-Za-z0-9+/=]+(?:\?.*)?$/);

    const lastSegment = urlStr.split('/').pop()!.split('?')[0];
    expect(lastSegment).toBe(btoa(endpoint));
  });
});
