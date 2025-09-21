import { describe, it, expect } from 'vitest';
import { Prism } from '@/shared/lib/prism-config';

describe('prism-config', () => {
  it('exports Prism with manual mode enabled', () => {
    expect(Prism).toBeTruthy();
    expect((Prism as unknown as { manual: boolean }).manual).toBe(true);
  });
});
