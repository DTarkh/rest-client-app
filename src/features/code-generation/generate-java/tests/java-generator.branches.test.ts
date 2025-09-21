import { describe, it, expect } from 'vitest';
import { JavaGenerator } from '../api/java-generator';
import type { HttpRequest } from '@/entities/http-request';

function build(over: Partial<HttpRequest>): HttpRequest {
  return {
    method: 'GET',
    url: 'example.local',
    headers: [],
    body: '',
    bodyType: 'none',
    ...over,
  } as HttpRequest;
}

function gen(over: Partial<HttpRequest>) {
  return JavaGenerator.generate(build(over));
}

describe('JavaGenerator branches', () => {
  it('missing url check', () => {
    const code = JavaGenerator.generate(build({ url: '' }));
    expect(code).toMatch(/Недостаточно данных/);
  });
  it('ensureAbsoluteUrl adds protocol', () => {
    const code = gen({ url: 'host/path' });
    expect(code).toMatch(/https:\/\/host\/path/);
  });
  it('body present vs absent', () => {
    const withBody = gen({ method: 'PUT', body: 'xyz' });
    expect(withBody).toMatch(/"xyz"/);
    const noBody = gen({ method: 'GET', body: 'xyz' });
    expect(noBody).not.toMatch(/"xyz"/);
  });
});
