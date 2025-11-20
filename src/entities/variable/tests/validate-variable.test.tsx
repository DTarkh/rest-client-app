import { describe, it, expect } from 'vitest';
import { validateVariable, validateVariableName } from '../lib/validate-variable';
import type { Variable } from '../model/variable.types';

describe('validateVariable & validateVariableName', () => {
  it('valid variable passes', () => {
    const result = validateVariable({ name: 'USER_NAME', value: 'john' }, []);
    expect(result.isValid).toBe(true);
  });

  it('requires name', () => {
    const r = validateVariable({ value: 'x' }, []);
    expect(r.isValid).toBe(false);
    expect(r.errors.name).toBeDefined();
  });

  it('rejects duplicate name', () => {
    const existing: Variable[] = [{ id: '1', name: 'DUP', value: '1', createdAt: 1, updatedAt: 1 }];
    const r = validateVariable({ name: 'DUP', value: '2' }, existing);
    expect(r.isValid).toBe(false);
  });

  it('validateVariableName enforces pattern & length', () => {
    expect(validateVariableName('A_1')).toBe(true);
    expect(validateVariableName('1BAD')).toBe(false);
    expect(validateVariableName('LONG'.repeat(20))).toBe(false);
  });
});
