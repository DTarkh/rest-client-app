import { describe, it, expect } from 'vitest';
import { CodeGenerator } from '../api/code-generator';
import type { HttpRequest } from '@/entities/http-request/model/request.types';
import type { SupportedLanguage } from '@/entities/code-snippet';

const base: HttpRequest = {
  method: 'POST',
  url: 'https://api.example.com/v1/resource',
  headers: [
    { id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true },
    { id: 'h2', key: 'X-Test', value: '1', enabled: true },
  ],
  body: '{"a":1}',
  bodyType: 'json',
};

describe('CodeGenerator switch coverage', () => {
  const langs: SupportedLanguage[] = [
    'curl',
    'javascript-fetch',
    'javascript-xhr',
    'nodejs',
    'python',
    'java',
    'csharp',
    'go',
  ];
  for (const lang of langs) {
    it(`generates code for ${lang}`, () => {
      const code = CodeGenerator.generate(base, lang);
      expect(code).toContain('api.example.com');
    });
  }

  it('returns fallback for unsupported language', () => {
    const code = CodeGenerator.generate(base, 'rust' as unknown as SupportedLanguage);
    expect(code).toContain('еще не реализован');
  });

  it('catches generator exception safely', () => {
    // Monkey patch private generator
    // @ts-expect-error accessing private method for test
    const original = CodeGenerator.generateXHR;
    // @ts-expect-error override private
    CodeGenerator.generateXHR = () => {
      throw new Error('boom');
    };
    const code = CodeGenerator.generate(base, 'javascript-xhr');
    expect(code).toContain('Ошибка генерации');
    // @ts-expect-error restore
    CodeGenerator.generateXHR = original;
  });
});
