import { describe, it, expect } from 'vitest';
import { PythonRequestsGenerator } from '../api/requests-generator';
import type { HttpRequest } from '@/entities/http-request';

function build(over: Partial<HttpRequest>): HttpRequest {
  return {
    method: 'GET',
    url: 'service.local',
    headers: [],
    body: '',
    bodyType: 'none',
    ...over,
  } as HttpRequest;
}

function gen(over: Partial<HttpRequest>) {
  return PythonRequestsGenerator.generate(build(over));
}

describe('PythonRequestsGenerator branches', () => {
  it('returns message for missing url', () => {
    const code = PythonRequestsGenerator.generate(build({ url: '' }));
    expect(code).toMatch(/Недостаточно данных/);
  });
  it('json body vs plain body detection', () => {
    const jsonCode = gen({ method: 'POST', body: '{"a":1}' });
    expect(jsonCode).toContain('json={"a":1}');
    const textCode = gen({ method: 'POST', body: 'plain' });
    expect(textCode).toContain('"""plain"""');
  });
});
