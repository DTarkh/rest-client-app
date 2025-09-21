import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVariableStore } from '../model/variable.store';
import type { VariableState } from '../model/variable.types';
const asState = (v: unknown) => v as VariableState;

const add = (store: VariableState, name: string, value: string) =>
  store.addVariable({ name, value });

describe('variable.store negative scenarios', () => {
  it('prevents duplicate name', async () => {
    const { result } = renderHook(() => useVariableStore());
    await act(async () => {
      await add(asState(result.current), 'HOST', 'a');
    });
    await expect(
      act(async () => {
        await add(asState(result.current), 'HOST', 'b');
      }),
    ).rejects.toThrow('Переменная с таким именем уже существует');
  });

  it('updateVariable throws when not found', async () => {
    const { result } = renderHook(() => useVariableStore());
    await expect(
      act(async () => {
        await result.current.updateVariable('missing-id', { value: 'x' });
      }),
    ).rejects.toThrow('Переменная не найдена');
  });

  it('updateVariable validation error (empty name)', async () => {
    const { result } = renderHook(() => useVariableStore());
    await act(async () => {
      await add(asState(result.current), 'TOKEN', 'abc');
    });
    const id = result.current.variables[0].id;
    await expect(
      act(async () => {
        await result.current.updateVariable(id, { name: '' });
      }),
    ).rejects.toThrow();
  });

  it('deleteVariable clears selectedVariableId if matches', async () => {
    const { result } = renderHook(() => useVariableStore());
    await act(async () => {
      await add(asState(result.current), 'X', '1');
    });
    const id = result.current.variables[0].id;
    act(() => {
      result.current.setSelectedVariable(id);
    });
    await act(async () => {
      await result.current.deleteVariable(id);
    });
    expect(result.current.selectedVariableId).toBeNull();
  });
});
