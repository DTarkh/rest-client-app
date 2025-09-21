import '@testing-library/jest-dom';
import { beforeEach, beforeAll, afterAll, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = '';
});

const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is deprecated')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return {
      $$typeof: Symbol.for('react.element'),
      type: 'img',
      ref: null,
      key: null,
      props,
      _owner: null,
    } as any;
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    message: vi.fn(),
  },
}));

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;
