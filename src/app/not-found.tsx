'use client';

import Link from 'next/link';
import { Button } from '@/src/shared/ui/button';
import { Card, CardContent } from '@/src/shared/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <Card className='w-full max-w-lg'>
        <CardContent className='text-center py-12'>
          <div className='text-6xl font-bold text-gray-300 mb-4'>404</div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Страница не найдена</h1>
          <p className='text-gray-600 mb-6'>
            К сожалению, страница которую вы ищете не существует или была перемещена
          </p>

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button asChild className='gap-2'>
              <Link href='/'>
                <Home size={16} />
                На главную
              </Link>
            </Button>

            <Button variant='outline' onClick={() => window.history.back()} className='gap-2'>
              <ArrowLeft size={16} />
              Назад
            </Button>

            <Button variant='outline' asChild className='gap-2'>
              <Link href='/client'>
                <Search size={16} />
                REST Client
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
