import { routes } from '@/src/shared/constants';
import Link from 'next/link';

export function Hero() {
  return (
    <section className='pt-50 pb-20 px-4'>
      <div className='container mx-auto max-w-6xl text-center'>
        <span className='inline-block mb-4 px-3 py-1 text-sm bg-gray-100 text-gray-700 border border-gray-200 rounded-full'>
          Professional API Testing Tool
        </span>

        <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance'>
          Streamline Your API Testing
        </h1>

        <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty'>
          A powerful REST client built for developers and teams. Test APIs, manage requests, track
          history, and generate code in multiple languages - all in one professional platform.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link href={routes.client} className='btn'>
            Start Testing APIs <span className='ml-2'>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
