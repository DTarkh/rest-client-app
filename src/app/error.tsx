'use client';

import { Button } from '@/src/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className='min-h-screen flex items-center justify-center bg-gray-50'>
        <Card className='max-w-md w-full shadow-lg'>
          <CardHeader>
            <CardTitle className='text-red-600'>Something went wrong!</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-gray-600'>{error.message}</p>
            <Button onClick={() => reset()} variant='destructive' className='w-full'>
              Try again
            </Button>
          </CardContent>
        </Card>
      </body>
    </html>
  );
}
