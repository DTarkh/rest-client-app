import { describe, it, expect } from 'vitest';
import { NodeJsGenerator } from '../api/node-generator';
import type { HttpRequest } from '@/entities/http-request';

function build(over: Partial<HttpRequest>): HttpRequest {
  return {
    method: 'GET',
    url: 'api.example.com',
    headers: [],
    body: '',
    bodyType: 'none',
    ...over,
  } as HttpRequest;
}

function gen(over: Partial<HttpRequest>) {
  return NodeJsGenerator.generate(build(over));
}

describe('NodeJsGenerator branches', () => {
  it('fails with message if no url', () => {
    const code = NodeJsGenerator.generate(build({ url: '' }));
    expect(code).toMatch(/Недостаточно данных/);
  });
  it('adds data only for methods with body', () => {
    const g1 = gen({ method: 'GET', body: 'x' });
    expect(g1).not.toContain('const data =');
    const g2 = gen({ method: 'DELETE', body: 'x' });
    expect(g2).toContain('const data =');
  });
});
