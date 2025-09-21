import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useRequestBody } from '../model/use-request-body';

describe('useRequestBody hook (prettifyJson)', () => {
  it('prettifies valid JSON when bodyType is json', () => {
    const { result } = renderHook(() =>
      useRequestBody({ initialBody: '{"a":1}', initialType: 'json' }),
    );
    act(() => {
      result.current.prettifyJson();
    });
    expect(result.current.body).toBe(`{
  "a": 1
}`);
    expect(result.current.isJsonValid).toBe(true);
  });

  it('does not modify invalid JSON body', () => {
    const { result } = renderHook(() =>
      useRequestBody({ initialBody: '{invalid', initialType: 'json' }),
    );
    const before = result.current.body;
    act(() => {
      result.current.prettifyJson();
    });
    expect(result.current.body).toBe(before); // unchanged
    expect(result.current.isJsonValid).toBe(false);
  });

  it('switching to none clears body', () => {
    const { result } = renderHook(() =>
      useRequestBody({ initialBody: '{"a":1}', initialType: 'json' }),
    );
    act(() => {
      result.current.setBodyType('none');
    });
    expect(result.current.body).toBe('');
  });
});
