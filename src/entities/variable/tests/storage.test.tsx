import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VariableStorage } from '../lib/storage';
import type { Variable } from '../model/variable.types';

// Mock localforage instance methods used internally
vi.mock('localforage', () => {
  let store: Record<string, unknown> = {};
  return {
    default: {
      createInstance: () => ({
        getItem: vi.fn(async (k: string) => store[k] ?? null),
        setItem: vi.fn(async (k: string, v: unknown) => {
          store[k] = v;
          return v;
        }),
        removeItem: vi.fn(async (k: string) => {
          delete store[k];
        }),
      }),
    },
  };
});

describe('VariableStorage', () => {
  const sample: Variable[] = [{ id: '1', name: 'X', value: '1', createdAt: 1, updatedAt: 1 }];

  beforeEach(async () => {
    await VariableStorage.clearVariables();
  });

  it('saves and loads variables', async () => {
    await VariableStorage.saveVariables(sample);
    const loaded = await VariableStorage.loadVariables();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe('X');
  });

  it('exports masks secret values', async () => {
    await VariableStorage.saveVariables([
      { id: '1', name: 'SECRET', value: 'top', isSecret: true, createdAt: 1, updatedAt: 1 },
    ]);
    const json = await VariableStorage.exportVariables();
    expect(json).toContain('***SECRET***');
  });

  it('imports variables, replacing ***SECRET*** with empty value', async () => {
    const imported = await VariableStorage.importVariables(
      JSON.stringify({ variables: [{ name: 'SECRET', value: '***SECRET***' }] }),
    );
    expect(imported[0].value).toBe('');
  });
});
