import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { VariablesManager } from '../ui/VariablesManager';
import { I18nProvider } from '@/shared/lib/i18n';
import { useVariableStore } from '@/entities/variable';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('@/entities/variable/lib/storage', async original => {
  const mod = (await original()) as Record<string, unknown>;
  let vars: unknown[] = [];
  return {
    ...mod,
    VariableStorage: {
      ...(mod.VariableStorage || {}),
      loadVariables: vi.fn(async () => vars),
      saveVariables: vi.fn(async (v: unknown[]) => {
        vars = v;
      }),
      clearVariables: vi.fn(async () => {
        vars = [];
      }),
      exportVariables: vi.fn(async () => JSON.stringify({ variables: vars })),
      importVariables: vi.fn(async (json: string) => {
        const parsed = JSON.parse(json);
        const imp = parsed.variables || parsed;
        vars.push(...imp);
        return imp;
      }),
    },
  };
});

function renderWithProviders(ui: React.ReactElement) {
  return render(<I18nProvider lang='ru'>{ui}</I18nProvider>);
}

describe('VariablesManager UI', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('создание переменной', async () => {
    renderWithProviders(<VariablesManager />);
    const addBtn = await screen.findByTestId('add-variable-btn');
    fireEvent.click(addBtn);
    await screen.findByTestId('variable-form');
    fireEvent.change(screen.getByTestId('variable-name-input'), { target: { value: 'API_KEY' } });
    fireEvent.change(screen.getByTestId('variable-value-input'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByTestId('variable-submit-btn'));
    await waitFor(() => {
      const store = useVariableStore.getState();
      expect(store.variables.find(v => v.name === 'API_KEY')).toBeTruthy();
    });
  });

  it('редактирование переменной', async () => {
    renderWithProviders(<VariablesManager />);
    await screen.findByTestId('add-variable-btn');
    await act(async () => {
      useVariableStore.setState({
        variables: [
          {
            id: '1',
            name: 'BASE_URL',
            value: 'http://x',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      });
    });
    await waitFor(() => expect(screen.getAllByTestId('variable-card').length).toBe(1));
    fireEvent.click(screen.getByTestId('edit-variable'));
    const nameInput = screen.getByTestId('variable-name-input') as HTMLInputElement;
    await act(async () => {
      nameInput.value = '';
      fireEvent.change(nameInput, { target: { value: '' } });
    });
    fireEvent.change(nameInput, { target: { value: 'BASE_URL_NEW' } });
    fireEvent.click(screen.getByTestId('variable-submit-btn'));
    await waitFor(() => {
      const store = useVariableStore.getState();
      expect(store.variables.find(v => v.name === 'BASE_URL_NEW')).toBeTruthy();
    });
  });

  it('удаление переменной', async () => {
    renderWithProviders(<VariablesManager />);
    await screen.findByTestId('add-variable-btn');
    await act(async () => {
      useVariableStore.setState({
        variables: [
          { id: 'd1', name: 'TO_DELETE', value: '1', createdAt: Date.now(), updatedAt: Date.now() },
        ],
      });
    });
    await waitFor(() => expect(screen.getAllByTestId('variable-card').length).toBe(1));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(screen.getByTestId('delete-variable'));
    await waitFor(() => {
      const store = useVariableStore.getState();
      expect(store.variables.find(v => v.name === 'TO_DELETE')).toBeFalsy();
    });
  });

  it('поиск фильтрует список', async () => {
    renderWithProviders(<VariablesManager />);
    await screen.findByTestId('add-variable-btn');
    await act(async () => {
      useVariableStore.setState({
        variables: [
          { id: '1', name: 'ONE', value: '1', createdAt: Date.now(), updatedAt: Date.now() },
          { id: '2', name: 'TWO', value: '2', createdAt: Date.now(), updatedAt: Date.now() },
        ],
      });
    });
    await waitFor(() => expect(screen.getAllByTestId('variable-card').length).toBe(2));
    const search = screen.getByTestId('variables-search-input');
    fireEvent.change(search, { target: { value: 'ONE' } });
    await waitFor(() => expect(screen.getAllByTestId('variable-card').length).toBe(1));
  });
});
