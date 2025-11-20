import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVariableStore } from '@/entities/variable/model/variable.store';
import { Variable } from '@/entities/variable/model/variable.types';

// Переменные объявим, но наполним позже внутри фабрики чтобы избежать hoist проблем
let imported: Variable[] = [];
export function setImported(vars: Variable[]) {
  imported = vars;
}

vi.mock('@/entities/variable/lib/storage', () => {
  const saveMock = vi.fn().mockResolvedValue(undefined);
  const importMock = vi.fn().mockImplementation(async () => imported);
  return {
    VariableStorage: {
      saveVariables: saveMock,
      importVariables: importMock,
      loadVariables: vi.fn().mockResolvedValue([]),
    },
  };
});

describe('variable.store export & import', () => {
  beforeEach(() => {
    // Reset store state manually (Zustand doesn't auto-reset between tests)
    // Полный сброс: проще пересоздать нужные поля напрямую обращаясь к внутреннему состоянию
    useVariableStore.setState({
      variables: [],
      isLoading: false,
      searchQuery: '',
      selectedVariableId: null,
    });
  });

  it('exportVariables returns JSON with metadata and existing variables', () => {
    const existing: Variable = {
      id: '1',
      name: 'API_URL',
      value: 'https://api',
      description: 'base',
      isSecret: false,
      createdAt: 1,
      updatedAt: 1,
    };
    useVariableStore.getState().setVariables([existing]);

    const json = useVariableStore.getState().exportVariables(); // реальная функция из стора
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe('1.0');
    expect(Array.isArray(parsed.variables)).toBe(true);
    expect(parsed.variables[0].name).toBe('API_URL');
  });

  it('importVariables merges existing with imported', async () => {
    const existing: Variable = {
      id: '1',
      name: 'API_URL',
      value: 'https://api',
      description: 'base',
      isSecret: false,
      createdAt: 1,
      updatedAt: 1,
    };
    useVariableStore.getState().setVariables([existing]);

    setImported([
      {
        id: '2',
        name: 'TOKEN',
        value: 'abc',
        description: '',
        isSecret: false,
        createdAt: 2,
        updatedAt: 2,
      },
    ]);

    await useVariableStore.getState().importVariables('{}');
    const names = useVariableStore
      .getState()
      .variables.map(v => v.name)
      .sort();
    expect(names).toEqual(['API_URL', 'TOKEN']);
  });
});
