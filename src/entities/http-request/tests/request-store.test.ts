import { describe, it, expect } from 'vitest';
import { useRequestStore } from '../model/request.store';
import { act, renderHook } from '@testing-library/react';

describe('useRequestStore', () => {
  it('validates URL and JSON body, header value required', () => {
    const { result } = renderHook(() => useRequestStore());

    act(() => {
      result.current.setUrl('not-a-url');
    });
    expect(result.current.validationErrors.url).toBe('urlInvalid');

    act(() => {
      result.current.setUrl('ftp://example.com');
    });
    expect(result.current.validationErrors.url).toBe('urlProtocol');

    act(() => {
      result.current.setUrl('https://example.com');
    });
    expect(result.current.validationErrors.url).toBeUndefined();

    act(() => {
      result.current.addHeader();
    });
    const headerId = result.current.currentRequest.headers[0].id;

    act(() => {
      result.current.setHeaders([{ id: headerId, key: 'X-Test', value: '', enabled: true }]);
    });
    expect(result.current.validationErrors[`header-${headerId}`]).toBe('headerValueRequired');

    act(() => {
      result.current.setHeaders([{ id: headerId, key: 'X-Test', value: '1', enabled: true }]);
    });
    expect(result.current.validationErrors[`header-${headerId}`]).toBeUndefined();

    act(() => {
      result.current.setBody('{invalid', 'json');
    });
    expect(result.current.validationErrors.body).toBe('invalidJson');

    act(() => {
      result.current.setBody('{"a":1}', 'json');
    });
    expect(result.current.validationErrors.body).toBeUndefined();
  });

  it('toggle and remove header update validation', () => {
    const { result } = renderHook(() => useRequestStore());
    act(() => {
      result.current.addHeader();
      result.current.addHeader();
    });
    const id = result.current.currentRequest.headers[0].id;
    const initialLen = result.current.currentRequest.headers.length;
    act(() => {
      result.current.toggleHeader(id);
    });
    expect(result.current.currentRequest.headers[0].enabled).toBe(false);
    act(() => {
      result.current.removeHeader(id);
    });
    expect(result.current.currentRequest.headers.length).toBe(initialLen - 1);
    expect(result.current.currentRequest.headers.find(h => h.id === id)).toBeUndefined();
  });

  it('resetRequest resets state', () => {
    const { result } = renderHook(() => useRequestStore());
    act(() => {
      result.current.setUrl('https://x');
      result.current.resetRequest();
    });
    expect(result.current.currentRequest.url).toBe('');
  });
});
