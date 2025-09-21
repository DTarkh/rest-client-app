import { describe, it, expect, beforeAll } from 'vitest';
import { encodeRequestToUrl } from '../lib/encode-request';
import { decodeRequestFromUrl } from '../lib/decode-request';

// Polyfill crypto.randomUUID for decode
beforeAll(() => {
  // jsdom предоставляет window.crypto с getter – подпачим randomUUID если отсутствует
  const g = global as unknown as { crypto?: { randomUUID?: () => string } };
  if (!g.crypto) {
    g.crypto = {};
  }
  if (!g.crypto.randomUUID) {
    g.crypto.randomUUID = () => 'uuid-1';
  }
});

describe('encode/decode request URL helpers', () => {
  const baseRequest = {
    method: 'POST' as const,
    url: 'https://api.example.com/v1/users',
    headers: [
      { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
      { id: '2', key: 'X-Ignored', value: 'nope', enabled: false }, // disabled should be skipped
      { id: '3', key: 'Authorization', value: 'Bearer token', enabled: true },
      { id: '4', key: '', value: '   ', enabled: true }, // empty key ignored naturally when filtering
    ],
    body: '{"a":1}',
    bodyType: 'json' as const,
  };

  it('encodes request into /client/METHOD/base64Url/base64Body?headers', () => {
    const url = encodeRequestToUrl(baseRequest);
    expect(url.startsWith('/client/POST/')).toBe(true);
    expect(url).toContain('Content-Type=application%2Fjson');
    expect(url).toContain('Authorization=Bearer+token');
    // disabled header absent
    expect(url).not.toContain('X-Ignored');
  });

  it('decodes previously encoded request', () => {
    const encoded = encodeRequestToUrl(baseRequest);
    // Split path after /client/
    const pathPart = encoded.replace(/^\/client\//, '').split('?')[0];
    const params = pathPart.split('/');
    const searchParams = new URLSearchParams(encoded.split('?')[1]);
    const decoded = decodeRequestFromUrl(params, searchParams);
    expect(decoded.method).toBe('POST');
    expect(decoded.url).toBe(baseRequest.url);
    expect(decoded.body).toBe(baseRequest.body);
    // Only enabled headers
    const headerKeys = decoded.headers.map(h => h.key);
    expect(headerKeys).toContain('Content-Type');
    expect(headerKeys).toContain('Authorization');
    expect(headerKeys).not.toContain('X-Ignored');
    expect(decoded.bodyType).toBe('json');
  });

  it('gracefully handles invalid base64 segments', () => {
    const decoded = decodeRequestFromUrl(['GET', '***bad***', '***bad***'], new URLSearchParams());
    expect(decoded.url).toBe('');
    expect(decoded.body).toBe('');
    expect(decoded.method).toBe('GET');
  });
});
