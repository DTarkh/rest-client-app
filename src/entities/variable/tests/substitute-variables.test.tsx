import { describe, it, expect } from 'vitest';
import {
  substituteVariables,
  findVariablesInText,
  hasVariables,
  validateVariablesInText,
  type Variable,
} from '../lib/substitute-variables';
import { highlightVariables } from '../lib/preview-substitution';

const variables: Variable[] = [
  { id: '1', name: 'HOST', value: 'example.com', createdAt: 1, updatedAt: 1 },
  { id: '2', name: 'PORT', value: '8080', createdAt: 1, updatedAt: 1 },
  { id: '3', name: 'TOKEN', value: 'abc123', createdAt: 1, updatedAt: 1 },
];

describe('variable substitution utilities', () => {
  it('replaces variables and counts occurrences', () => {
    const text = 'http://{{HOST}}:{{PORT}}/auth?token={{TOKEN}}&again={{TOKEN}}';
    const result = substituteVariables(text, variables);
    expect(result.text).toBe('http://example.com:8080/auth?token=abc123&again=abc123');
    const tokenSub = result.substitutions.find(s => s.variable === 'TOKEN');
    expect(tokenSub?.count).toBe(2);
    expect(result.missingVariables.length).toBe(0);
  });

  it('keeps unknown variables and reports them as missing', () => {
    const text = 'Hello {{USER}} at {{HOST}}';
    const result = substituteVariables(text, variables);
    expect(result.text).toBe('Hello {{USER}} at example.com');
    expect(result.missingVariables).toEqual(['USER']);
  });

  it('findVariablesInText returns unique variable names', () => {
    const names = findVariablesInText('{{A}}-{{B}}-{{A}}');
    expect(names).toEqual(['A', 'B']);
  });

  it('hasVariables detects presence of pattern', () => {
    expect(hasVariables('no vars')).toBe(false);
    expect(hasVariables('value {{X}} here')).toBe(true);
  });

  it('validateVariablesInText finds missing ones', () => {
    const validation = validateVariablesInText('URL {{HOST}} / {{MISS}}', variables);
    expect(validation.isValid).toBe(false);
    expect(validation.missingVariables).toEqual(['MISS']);
  });

  it('highlightVariables wraps variable occurrences in mark tag', () => {
    const html = highlightVariables('Test {{HOST}}');
    expect(html).toContain('<mark');
    expect(html).toContain('{{HOST}}');
  });
});
