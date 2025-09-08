import { createContext, type Context, use } from 'react';

export function useStrictContext<T>(context: Context<T | null>) {
  const value = use(context);
  if (value === null) throw new Error('Strict context not passed');
  return value as T;
}

export function createStrictContext<T>() {
  return createContext<T | null>(null);
}
