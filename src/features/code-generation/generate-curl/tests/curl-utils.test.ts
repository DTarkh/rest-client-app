import { describe, it, expect } from 'vitest';
import {
  ensureAbsoluteUrl,
  methodAllowsBody,
  headerValue,
  normalizeBodyForCurl,
  shellQuoteSingle,
  headersToRecord,
} from '../api/curl-generator';

describe('curl-generator utils', () => {
  it('ensureAbsoluteUrl adds https when missing', () => {
    expect(ensureAbsoluteUrl('api.example.com')).toBe('https://api.example.com');
    expect(ensureAbsoluteUrl('http://x.com')).toBe('http://x.com');
  });

  it('methodAllowsBody logic', () => {
    expect(methodAllowsBody('post')).toBe(true);
    expect(methodAllowsBody('get')).toBe(false);
  });

  it('headerValue finds header case-insensitive', () => {
    expect(headerValue([{ key: 'Content-Type', value: 'x', enabled: true }], 'content-type')).toBe(
      'x',
    );
  });

  it('normalizeBodyForCurl parses json or returns raw', () => {
    expect(normalizeBodyForCurl('{"a":1}', 'application/json')).toBe('{"a":1}');
    expect(normalizeBodyForCurl('{invalid}', 'application/json')).toBe('{invalid}');
  });

  it('shellQuoteSingle escapes correctly', () => {
    expect(shellQuoteSingle("O'Reilly")).toBe("'O'\\''Reilly'");
  });

  it('headersToRecord converts array', () => {
    expect(headersToRecord([{ key: 'A', value: '1' }])).toEqual({ A: '1' });
  });
});
