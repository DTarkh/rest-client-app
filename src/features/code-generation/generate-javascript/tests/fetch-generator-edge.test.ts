import { describe, it, expect } from 'vitest';
import { FetchGenerator } from '../api/fetch-generator';
import type { HttpRequest } from '@/entities/http-request/model/request.types';

const base = (over: Partial<HttpRequest>): HttpRequest => ({
  method: 'GET',
  url: 'https://example.com',
  headers: [],
  body: '',
  bodyType: 'json',
  ...over,
});

describe('FetchGenerator edge cases', () => {
  it('returns early message when url/method missing', () => {
    const msg = FetchGenerator.generate(base({ url: '' }));
    expect(msg).toContain('Недостаточно данных');
  });

  it('non-json body becomes template literal', () => {
    const code = FetchGenerator.generate(base({ method: 'POST', body: 'plain text' }));
    expect(code).toContain('plain text');
    expect(code).toContain('fetch(');
  });
});
