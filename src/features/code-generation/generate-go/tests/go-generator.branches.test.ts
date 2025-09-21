import { describe, it, expect } from 'vitest';
import { GoGenerator } from '../api/go-generator';
import type { HttpRequest } from '@/entities/http-request';

function build(over: Partial<HttpRequest>): HttpRequest {
  return {
    method: 'GET',
    url: 'api.local/test',
    headers: [],
    body: '',
    bodyType: 'none',
    ...over,
  } as HttpRequest;
}

function gen(over: Partial<HttpRequest>) {
  return GoGenerator.generate(build(over));
}

describe('GoGenerator branches', () => {
  it('missing url', () => {
    const code = GoGenerator.generate(build({ url: '' }));
    expect(code).toMatch(/Недостаточно данных/);
  });
  it('adds protocol when missing', () => {
    const code = gen({ url: 'service/path' });
    expect(code).toMatch(/https:\/\/service\/path/);
  });
  it('includes body only for body methods', () => {
    const withBody = gen({ method: 'POST', body: 'abc' });
    expect(withBody).toMatch(/strings.NewReader/);
    const noBody = gen({ method: 'GET', body: 'abc' });
    expect(noBody).not.toMatch(/NewReader/);
  });
});
