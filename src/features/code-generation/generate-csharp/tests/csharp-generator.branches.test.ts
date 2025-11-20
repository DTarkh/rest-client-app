import { describe, it, expect } from 'vitest';
import { CSharpGenerator } from '../api/csharp-generate';
import type { HttpRequest } from '@/entities/http-request';

function build(over: Partial<HttpRequest>): HttpRequest {
  return {
    method: 'GET',
    url: 'example.com',
    headers: [],
    body: '',
    bodyType: 'none',
    ...over,
  } as HttpRequest;
}

function gen(over: Partial<HttpRequest>) {
  return CSharpGenerator.generate(build(over));
}

describe('CSharpGenerator branches', () => {
  it('returns message when no url', () => {
    const code = CSharpGenerator.generate(build({ url: '' }));
    expect(code).toMatch(/Недостаточно данных/);
  });
  it('adds body only for body-allowed method', () => {
    const codeNo = gen({ method: 'GET', body: ' {"a":1}' });
    expect(codeNo).toContain('HttpMethod.Get');
    expect(codeNo).not.toContain('StringContent');
    const codeYes = gen({
      method: 'POST',
      body: '{"a":1}',
      headers: [{ id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true }],
      bodyType: 'json',
    });
    expect(codeYes).toContain('StringContent');
  });
  it('escapes quotes in headers and body', () => {
    const code = gen({
      method: 'POST',
      body: '"x"',
      headers: [{ id: 'h1', key: 'X-Header', value: 'va"l', enabled: true }],
      bodyType: 'json',
    });
    expect(code).toMatch(/va\\"l/);
    expect(code).toContain('@"""x"""');
  });
});
