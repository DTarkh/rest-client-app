import { describe, it, expect } from 'vitest';
import { validateVariable } from '../lib/validate-variable';
import type { Variable } from '../model/variable.types';

describe('validateVariable additional branches', () => {
  const existing: Variable[] = [{ id: '1', name: 'EXIST', value: 'v', createdAt: 1, updatedAt: 1 }];

  it('missing value', () => {
    const r = validateVariable({ name: 'NEW' }, existing);
    expect(r.isValid).toBe(false);
    expect(r.errors.value).toBeDefined();
  });

  it('too long value (>1000)', () => {
    const long = 'x'.repeat(1001);
    const r = validateVariable({ name: 'LONGVAL', value: long }, existing);
    expect(r.isValid).toBe(false);
    expect(r.errors.value).toMatch(/1000/);
  });

  it('too long description (>200)', () => {
    const longDesc = 'd'.repeat(201);
    const r = validateVariable({ name: 'DESC', value: 'ok', description: longDesc }, existing);
    expect(r.isValid).toBe(false);
    expect(r.errors.description).toMatch(/200/);
  });

  it('excludeId allows same name when editing itself', () => {
    const r = validateVariable({ name: 'EXIST', value: 'changed' }, existing, '1');
    expect(r.isValid).toBe(true);
  });
});
