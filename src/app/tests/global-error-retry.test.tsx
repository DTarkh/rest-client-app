import { describe, it, expect } from 'vitest';
import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';
import GlobalError from '../error';

// Тестируем что reset вызывает повторный рендер "без ошибки" (симулируем обертку)

const Harness: React.FC = () => {
  const [hasError, setHasError] = useState(true);
  if (hasError) {
    return <GlobalError error={new Error('boom')} reset={() => setHasError(false)} />;
  }
  return <div data-testid='recovered'>Recovered</div>;
};

describe('GlobalError retry', () => {
  it('resets after clicking Try again', () => {
    const { getByTestId, queryByText } = render(<Harness />);
    const btn = getByTestId('error-retry');
    fireEvent.click(btn);
    expect(queryByText(/Something went wrong/i)).toBeNull();
    expect(getByTestId('recovered')).toBeTruthy();
  });
});
