'use client';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const content = (
    <Card className='max-w-md w-full shadow-lg'>
      <CardHeader>
        <CardTitle className='text-red-600'>Something went wrong!</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-sm text-gray-600'>{error.message}</p>
        <Button
          data-testid='error-retry'
          onClick={() => reset()}
          variant='destructive'
          className='w-full'
        >
          Try again
        </Button>
      </CardContent>
    </Card>
  );

  if (process.env.NODE_ENV === 'test') {
    return <div data-testid='global-error'>{content}</div>;
  }

  return (
    <html>
      <body className='min-h-screen flex items-center justify-center bg-gray-50'>{content}</body>
    </html>
  );
}
