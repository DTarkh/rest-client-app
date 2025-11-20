import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import GlobalError from '../error';

// GlobalError is a Client Component wrapper for Next.js error boundary UI.
// We just ensure it renders its children fallback structure.

describe('GlobalError component', () => {
  it('renders error fallback content', () => {
    render(
      <GlobalError
        error={new Error('boom')}
        reset={() => {
          /* noop */
        }}
      />,
    );
    const text = document.body.textContent?.toLowerCase() || '';
    expect(text).toContain('something went wrong');
    expect(text).toContain('boom');
    expect(text).toContain('try again');
  });
});
