import { describe, it, expect, vi } from 'vitest';
import { useInitializeVariables, useVariableStore } from '../model/variable.store';
import { renderHook, act } from '@testing-library/react';

vi.mock('../lib/storage', () => ({
  VariableStorage: {
    loadVariables: vi
      .fn()
      .mockResolvedValue([{ id: '1', name: 'A', value: '1', createdAt: 1, updatedAt: 1 }]),
    saveVariables: vi.fn(),
    importVariables: vi.fn(),
  },
}));

vi.mock('@/shared/lib/logger', () => ({ logger: vi.fn() }));

describe('useInitializeVariables', () => {
  it('loads variables and sets them into store', async () => {
    const { result } = renderHook(() => {
      const init = useInitializeVariables();
      return { init, state: useVariableStore() };
    });

    await act(async () => {
      await result.current.init();
    });

    expect(result.current.state.variables).toHaveLength(1);
    expect(result.current.state.isLoading).toBe(false);
  });
});
