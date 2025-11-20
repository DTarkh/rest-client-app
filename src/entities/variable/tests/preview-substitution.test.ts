import { describe, it, expect } from 'vitest';
import { createSubstitutionPreview, highlightVariables } from '../lib/preview-substitution';
import type { Variable } from '../model';

describe('createSubstitutionPreview & highlightVariables', () => {
  const vars: Variable[] = [
    { id: '1', name: 'HOST', value: 'example.com', createdAt: 1, updatedAt: 1 },
    { id: '2', name: 'PORT', value: '8080', createdAt: 1, updatedAt: 1 },
  ];

  it('builds preview with positions and substituted text', () => {
    const text = 'http://{{HOST}}:{{PORT}}/x';
    const preview = createSubstitutionPreview(text, vars);
    expect(preview.substitutedText).toBe('http://example.com:8080/x');
    expect(preview.foundVariables).toHaveLength(2);
    expect(preview.foundVariables[0].position.start).toBeGreaterThan(0);
    expect(preview.missingVariables).toHaveLength(0);
  });

  it('reports missing variables', () => {
    const text = 'Hello {{USER}}';
    const preview = createSubstitutionPreview(text, vars);
    expect(preview.missingVariables).toEqual(['USER']);
  });

  it('highlightVariables wraps occurrences', () => {
    const html = highlightVariables('X {{HOST}}');
    expect(html).toContain('<mark');
    expect(html).toContain('{{HOST}}');
  });
});
