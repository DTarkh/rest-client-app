import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VariableStorage } from '../lib/storage';
import * as loggerMod from '@/shared/lib/logger';

// Создаем управляемый mock без top-level await
type Behavior = 'ok' | 'error-set' | 'error-remove' | 'error-get';
let behavior: Behavior = 'ok';
vi.mock('localforage', () => {
  const mockApi = {
    setBehavior: (b: Behavior) => (behavior = b),
    createInstance: () => ({
      getItem: vi.fn(async () => {
        if (behavior === 'error-get') throw new Error('get fail');
        return null;
      }),
      setItem: vi.fn(async () => {
        if (behavior === 'error-set') throw new Error('set fail');
      }),
      removeItem: vi.fn(async () => {
        if (behavior === 'error-remove') throw new Error('remove fail');
      }),
    }),
  };
  return { default: mockApi };
});

describe('VariableStorage error branches', () => {
  const logSpy = vi.spyOn(loggerMod, 'logger').mockImplementation(() => {});

  beforeEach(() => {
    logSpy.mockClear();
    // сбрасываем поведение
    behavior = 'ok';
  });

  it('loadVariables handles getItem error and returns []', async () => {
    behavior = 'error-get';
    const vars = await VariableStorage.loadVariables();
    expect(vars).toEqual([]);
    expect(logSpy).toHaveBeenCalled();
  });

  it('saveVariables throws on setItem error', async () => {
    behavior = 'error-set';
    await expect(VariableStorage.saveVariables([])).rejects.toThrow(
      'Не удалось сохранить переменные',
    );
    expect(logSpy).toHaveBeenCalled();
  });

  it('clearVariables throws on removeItem error', async () => {
    behavior = 'error-remove';
    await expect(VariableStorage.clearVariables()).rejects.toThrow(
      'Не удалось очистить переменные',
    );
    expect(logSpy).toHaveBeenCalled();
  });

  it('importVariables invalid shape -> final user-friendly error', async () => {
    // отсутствует поле variables
    await expect(VariableStorage.importVariables(JSON.stringify({ wrong: [] }))).rejects.toThrow(
      'Не удалось импортировать переменные. Проверьте формат файла.',
    );
    expect(logSpy).toHaveBeenCalled();
  });
});
