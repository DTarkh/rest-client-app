import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVariableSubstitution } from '../model/use-variable-substitution';
import { useVariableStore } from '../model/variable.store';

const baseRequest = {
  url: 'https://{{HOST}}/api',
  method: 'GET' as const,
  headers: [
    { id: '1', key: 'X-Env', value: '{{ENV}}', enabled: true },
    { id: '2', key: 'Accept', value: 'application/json', enabled: true },
  ],
  body: 'token={{TOKEN}}',
  bodyType: 'text' as const,
};

describe('useVariableSubstitution', () => {
  it('substitutes variables and reports missing', async () => {
    const { result: store } = renderHook(() => useVariableStore());

    await act(async () => {
      await store.current.addVariable({ name: 'HOST', value: 'example.com' });
      await store.current.addVariable({ name: 'TOKEN', value: 'abc' });
    });

    const { result } = renderHook(() => useVariableSubstitution(baseRequest));

    expect(result.current.processedRequest.url).toBe('https://example.com/api');
    expect(result.current.processedRequest.body).toBe('token=abc');
    // ENV is missing
    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.issues.some(i => i.missingVariables.includes('ENV'))).toBe(
      true,
    );
  });
});
