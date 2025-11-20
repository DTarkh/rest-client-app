import { describe, it, expect } from 'vitest';
import { CurlGenerator } from '../api/curl-generator';
import type { HttpRequest } from '@/entities/http-request';

function build(over: Partial<HttpRequest>): HttpRequest {
  return {
    method: 'GET',
    url: 'http://example.com',
    headers: [],
    body: '',
    bodyType: 'none',
    ...over,
  } as HttpRequest;
}

function gen(over: Partial<HttpRequest>) {
  return CurlGenerator.generate(build(over));
}

describe('CurlGenerator branches', () => {
  it('handles missing url', () => {
    const code = CurlGenerator.generate(build({ url: '' }));
    expect(code).toMatch(/Недостаточно данных/);
  });
  it('json body parse success and failure + empty body', () => {
    const empty = gen({ body: '', method: 'POST' });
    expect(empty).not.toMatch(/--data/);
    const json = gen({ body: '{"x":1}', method: 'POST' });
    expect(json).toMatch(/--data/);
    const raw = gen({ body: '{notjson', method: 'POST' });
    expect(raw).toMatch(/--data/);
  });
  it('omits body for GET even if provided', () => {
    const code = gen({ body: '{"a":1}', method: 'GET' });
    expect(code).not.toMatch(/--data/);
  });
  it('escapes single quotes in body for shell quoting', () => {
    const code = gen({ body: "O'Hara", method: 'POST' });
    expect(code).toContain("O'\\''Hara");
  });
});
