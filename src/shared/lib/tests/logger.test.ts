import { describe, it, expect, vi } from 'vitest';
import { logger } from '../logger';

describe('logger', () => {
  it('calls console.log in development', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const envSpy = vi
      .spyOn(process, 'env', 'get')
      .mockReturnValue({ ...process.env, NODE_ENV: 'development' });
    logger('msg');
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
    envSpy.mockRestore();
  });

  it('does not call console.log outside development', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const envSpy = vi
      .spyOn(process, 'env', 'get')
      .mockReturnValue({ ...process.env, NODE_ENV: 'production' });
    logger('msg');
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
    envSpy.mockRestore();
  });
});
