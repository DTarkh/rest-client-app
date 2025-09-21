import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCodeGenerator } from '../model/use-code-generator';
import { useCodeSnippetStore } from '@/entities/code-snippet';
import { useVariableStore } from '@/entities/variable';
import type { HttpRequest } from '@/entities/http-request';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

function makeRequest(over: Partial<HttpRequest> = {}): HttpRequest {
  return {
    id: 'req1',
    method: 'POST',
    url: 'https://api.example.com/users',
    body: '{"token":"{{API_TOKEN}}"}',
    headers: [{ id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true }],
    bodyType: 'json',
    ...over,
  };
}

describe('useCodeGenerator', () => {
  beforeEach(() => {
    useCodeSnippetStore.getState().clearSnippets();
    useVariableStore.setState({
      variables: [
        {
          id: 'v1',
          name: 'API_TOKEN',
          value: 'abc123',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    });
  });

  it('генерирует код и подставляет переменные', async () => {
    const qc = new QueryClient();
    const { result } = renderHook(() => useCodeGenerator(), {
      wrapper: ({ children }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>,
    });
    await act(async () => {
      await result.current.mutateAsync({ request: makeRequest(), language: 'curl' });
    });
    const store = useCodeSnippetStore.getState();
    const snippet = store.snippets['curl'];
    expect(snippet).toBeTruthy();
    expect(snippet?.code).toContain('abc123');
    expect(snippet?.code).not.toContain('{{API_TOKEN}}');
    expect(snippet?.isValid).toBe(true);
  });

  it('устанавливает ошибочный сниппет при пустом результате', async () => {
    const mod = await import('../api/code-generator');
    const spy = vi.spyOn(mod.CodeGenerator, 'generate').mockReturnValue('');
    const qc = new QueryClient();
    const { result } = renderHook(() => useCodeGenerator(), {
      wrapper: ({ children }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>,
    });
    await act(async () => {
      await result.current.mutateAsync({ request: makeRequest(), language: 'python' });
    });
    const snippet = useCodeSnippetStore.getState().snippets['python'];
    expect(snippet?.isValid).toBe(false);
    spy.mockRestore();
  });
});
