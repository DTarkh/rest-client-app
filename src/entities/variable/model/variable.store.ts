import { devtools } from 'zustand/middleware';
import { Variable, VariableState } from './variable.types';
import { VariableStorage } from '../lib/storage';
import { validateVariable } from '../lib/validate-variable';
import { create } from 'zustand';
import { logger } from '@/shared/lib/logger';
import React from 'react';

export const useVariableStore = create<VariableState>()(
  devtools(
    (set, get) => ({
      variables: [],
      isLoading: false,
      searchQuery: '',
      selectedVariableId: null,

      addVariable: async newVariable => {
        const { variables } = get();

        const validation = validateVariable(newVariable, variables);
        if (!validation.isValid) {
          throw new Error(Object.values(validation.errors)[0]);
        }

        const variable: Variable = {
          ...newVariable,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const updatedVariables = [...variables, variable];

        await VariableStorage.saveVariables(updatedVariables);

        set({ variables: updatedVariables }, false, 'addVariable');
      },

      updateVariable: async (id, updates) => {
        const { variables } = get();
        const variableIndex = variables.findIndex(v => v.id === id);

        if (variableIndex === -1) {
          throw new Error('Переменная не найдена');
        }

        const existingVariable = variables[variableIndex];
        const updatedVariable = {
          ...existingVariable,
          ...updates,
          updatedAt: Date.now(),
        };

        const validation = validateVariable(updatedVariable, variables, id);
        if (!validation.isValid) {
          throw new Error(Object.values(validation.errors)[0]);
        }

        const updatedVariables = [...variables];
        updatedVariables[variableIndex] = updatedVariable;

        await VariableStorage.saveVariables(updatedVariables);

        set({ variables: updatedVariables }, false, 'updateVariable');
      },

      deleteVariable: async id => {
        const { variables } = get();
        const updatedVariables = variables.filter(v => v.id !== id);

        await VariableStorage.saveVariables(updatedVariables);

        set(
          {
            variables: updatedVariables,
            selectedVariableId: get().selectedVariableId === id ? null : get().selectedVariableId,
          },
          false,
          'deleteVariable',
        );
      },

      setVariables: variables => {
        set({ variables }, false, 'setVariables');
      },

      setLoading: loading => {
        set({ isLoading: loading }, false, 'setLoading');
      },

      setSearchQuery: query => {
        set({ searchQuery: query }, false, 'setSearchQuery');
      },

      setSelectedVariable: id => {
        set({ selectedVariableId: id }, false, 'setSelectedVariable');
      },

      getVariableById: id => {
        return get().variables.find(v => v.id === id);
      },

      getVariableByName: name => {
        return get().variables.find(v => v.name === name);
      },

      getFilteredVariables: () => {
        const { variables, searchQuery } = get();
        if (!searchQuery.trim()) return variables;

        const query = searchQuery.toLowerCase();
        return variables.filter(
          v =>
            v.name.toLowerCase().includes(query) ||
            v.value.toLowerCase().includes(query) ||
            v.description?.toLowerCase().includes(query),
        );
      },

      exportVariables: () => {
        const { variables } = get();
        return JSON.stringify(
          {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            variables,
          },
          null,
          2,
        );
      },

      importVariables: async data => {
        const importedVariables = await VariableStorage.importVariables(data);
        const { variables } = get();

        const allVariables = [...variables, ...importedVariables];

        await VariableStorage.saveVariables(allVariables);
        set({ variables: allVariables }, false, 'importVariables');
      },
    }),
    {
      name: 'variable-store',
    },
  ),
);

export const useInitializeVariables = () => {
  const { setVariables, setLoading } = useVariableStore();

  const initialize = React.useCallback(async () => {
    setLoading(true);
    try {
      const variables = await VariableStorage.loadVariables();
      setVariables(variables);
    } catch (error) {
      logger('Failed to initialize variables:', error);
    } finally {
      setLoading(false);
    }
  }, [setVariables, setLoading]);

  return initialize;
};
