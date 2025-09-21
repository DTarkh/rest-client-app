import { describe, it, expect } from 'vitest';
import { FetchGenerator } from '../api/fetch-generator';
import type { HttpRequest } from '@/entities/http-request';

function build(over: Partial<HttpRequest>): HttpRequest {
  return {
    method: 'POST',
    url: 'https://example.com',
    headers: [],
    body: '{"a":1}',
    bodyType: 'json',
    ...over,
  } as HttpRequest;
}

describe('FetchGenerator additional branches', () => {
  it('formats JSON body with JSON.stringify path', () => {
    const code = FetchGenerator.generate(build({ body: '{"a":1}' }));
    expect(code).toMatch(/JSON.stringify/);
    expect(code).toMatch(/"a": 1/);
  });

  it('returns error message when internal error thrown', () => {
    type FGWithPrivate = { guessBody: (raw: string) => string };
    const ref = FetchGenerator as unknown as FGWithPrivate;
    const original = ref.guessBody;
    ref.guessBody = () => {
      throw new Error('boom');
    };
    const code = FetchGenerator.generate(build({ body: '{"a":1}' }));
    expect(code).toMatch(/Ошибка генерации Fetch кода/);
    ref.guessBody = original;
  });
});
