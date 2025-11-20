import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SessionStorageApi } from '@/shared/lib/sessionStorage';
import * as loggerMod from '@/shared/lib/logger';

describe('SessionStorageApi', () => {
  const api = new SessionStorageApi('test-key');
  let originalSet: typeof sessionStorage.setItem;
  let originalGet: typeof sessionStorage.getItem;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    sessionStorage.clear();
    originalSet = sessionStorage.setItem;
    originalGet = sessionStorage.getItem;
    logSpy = vi.spyOn(loggerMod, 'logger').mockImplementation(() => {});
  });

  afterEach(() => {
    sessionStorage.setItem = originalSet;
    sessionStorage.getItem = originalGet;
    logSpy.mockRestore();
  });

  it('set/get/has/remove basic flow', () => {
    expect(api.has()).toBe(false);
    api.set({ a: 1 });
    expect(api.has()).toBe(true);
    expect(api.get()).toEqual({ a: 1 });
    api.remove();
    expect(api.has()).toBe(false);
  });

  it('gracefully logs error on serialization failure', () => {
    type Circular = { self?: Circular };
    const circular: Circular = {};
    circular.self = circular;
    api.set(circular);
    expect(logSpy).toHaveBeenCalled();
  });

  it('returns undefined and logs on invalid JSON during get', () => {
    sessionStorage.setItem('test-key', '{bad json');
    // Force parse error by overriding getItem to return invalid JSON
    sessionStorage.getItem = vi.fn(() => '{bad json') as unknown as typeof sessionStorage.getItem;
    const value = api.get();
    expect(value).toBeUndefined();
    expect(logSpy).toHaveBeenCalled();
  });
});
