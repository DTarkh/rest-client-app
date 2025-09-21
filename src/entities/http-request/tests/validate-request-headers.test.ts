import { describe, it, expect } from 'vitest';
import { validateRequest } from '@/entities/http-request/lib/validate-request';
import type { HttpRequest } from '@/entities/http-request';

const base: HttpRequest = {
  method: 'GET',
  url: 'http://example.com',
  headers: [],
  body: '',
  bodyType: 'json',
  timestamp: Date.now(),
};

describe('validateRequest additional branches', () => {
  it('flags unsupported protocol', () => {
    const r = { ...base, url: 'ftp://example.com' };
    const res = validateRequest(r);
    expect(res.validationErrors.url).toBe('urlProtocol');
  });

  it('flags header with value but empty key', () => {
    const r = {
      ...base,
      headers: [
        { id: '1', key: '', value: 'abc', enabled: true },
        { id: '2', key: 'X-Ok', value: '', enabled: true }, // ensure original path still OK
      ],
    } as HttpRequest;
    const res = validateRequest(r);
    // Could be either keyRequired or valueRequired; ensure both present
    expect(Object.values(res.validationErrors)).toContain('headerKeyRequired');
    expect(Object.values(res.validationErrors)).toContain('headerValueRequired');
  });
});
