import { LocalStorageFactory } from '../localStorage';

describe('LocalStorageFactory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should set and get a value', () => {
    const storage = new LocalStorageFactory('testKey');
    storage.set({ foo: 'bar' });

    const value = storage.get();
    expect(value).toEqual({ foo: 'bar' });
  });

  it('should remove a value', () => {
    const storage = new LocalStorageFactory('testKey');
    storage.set({ foo: 'bar' });
    storage.remove();

    const value = storage.get();
    expect(value).toBeUndefined();
  });

  it('should check if a key exists', () => {
    const storage = new LocalStorageFactory('testKey');
    expect(storage.has()).toBe(false);

    storage.set({ foo: 'bar' });
    expect(storage.has()).toBe(true);
  });

  it('should handle invalid JSON gracefully', () => {
    localStorage.setItem('testKey', 'invalid JSON');

    const storage = new LocalStorageFactory('testKey');
    const value = storage.get();
    expect(value).toBeUndefined();
  });
});
