export function logger(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('%c[Logger]', 'color: #4CAF50; font-weight: bold;', ...args);
  }
}
