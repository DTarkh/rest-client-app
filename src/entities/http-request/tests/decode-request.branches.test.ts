import { describe, it, expect, vi } from 'vitest';
import { decodeRequestFromUrl } from '../lib/decode-request';

// Helpers
const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');
const encBody = (s: string) => b64(encodeURIComponent(s));

// Spy on logger output (logger uses console.log in dev). We stub NODE_ENV to development.
vi.stubEnv('NODE_ENV', 'development');

describe('decodeRequestFromUrl branches', () => {
  it('gracefully handles invalid base64 url part', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const [method, encodedUrl] = ['GET', '%%%bad%%%'];
    const result = decodeRequestFromUrl([method, encodedUrl], new URLSearchParams());
    expect(result.url).toBe('');
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('gracefully handles invalid base64 body part', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const params = ['POST', b64('http://example.com'), '%%%bad%%%'];
    const result = decodeRequestFromUrl(params, new URLSearchParams());
    expect(result.body).toBe('');
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('classifies bodyType=json when JSON parses', () => {
    const body = '{"a":1}';
    const params = ['POST', b64('http://ex'), encBody(body)];
    const result = decodeRequestFromUrl(params, new URLSearchParams());
    expect(result.bodyType).toBe('json');
    expect(result.body).toBe(body);
  });

  it('classifies bodyType=text when JSON parse fails', () => {
    const body = 'not json';
    const params = ['POST', b64('http://ex'), encBody(body)];
    const result = decodeRequestFromUrl(params, new URLSearchParams());
    expect(result.bodyType).toBe('text');
  });

  it('classifies bodyType=none when body empty', () => {
    const params = ['GET', b64('http://ex')];
    const result = decodeRequestFromUrl(params, new URLSearchParams());
    expect(result.bodyType).toBe('none');
  });

  it('extracts headers from search params', () => {
    const sp = new URLSearchParams();
    sp.set('X-Test', '1');
    sp.set('Another', 'abc');
    const params = ['GET', b64('http://ex')];
    const result = decodeRequestFromUrl(params, sp);
    expect(result.headers.length).toBe(2);
    expect(result.headers.map(h => h.key)).toEqual(expect.arrayContaining(['X-Test', 'Another']));
  });
});
