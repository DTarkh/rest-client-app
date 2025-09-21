/* eslint-disable boundaries/entry-point, boundaries/element-types */
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { act } from 'react';

import { RequestBuilder } from '../ui/RequestBuilder';
import { AppProvider } from '@/src/app/_/providers/AppProvider';
import TanstackQueryProvider from '@/src/app/_/providers/TanstackQueryProvider';
import { useRequestStore } from '@/src/entities/http-request';

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

const UUID =
  '00000000-0000-4000-8000-000000000000' as `${string}-${string}-${string}-${string}-${string}`;
function ensureCryptoMock() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(UUID);
    return;
  }
  const mockRandomUUID: () => `${string}-${string}-${string}-${string}-${string}` = () => UUID;
  const mockCrypto: Crypto = {
    getRandomValues<T extends ArrayBufferView>(a: T): T {
      return a;
    },
    randomUUID: vi.fn(mockRandomUUID),
    // @ts-expect-error not needed in tests
    subtle: undefined,
  };
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: mockCrypto });
}
ensureCryptoMock();

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

describe('RequestBuilder – endpoint encoding', () => {
  it('base64-encodes endpoint into URL param on submit', async () => {
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

    const endpoint = 'https://example.test/posts/42?expand=comments';
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

    const m = urlStr.match(/^\/client\/([A-Z]+)\/([^?]+)(?:\?.*)?$/);
    expect(m).not.toBeNull();

    const [, methodCaptured, encodedEndpoint] = m!;
    expect(methodCaptured).toBe('POST');
    expect(encodedEndpoint).toBe(btoa(endpoint));
  });
});
