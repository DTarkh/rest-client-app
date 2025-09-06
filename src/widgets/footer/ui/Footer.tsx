import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import CourseLogo from '@/public/rss-logo.svg';

export function Footer() {
  return (
    <footer className='py-5 px-4 border-t border-gray-200 bg-white'>
      <div className='flex flex-col md:flex-row justify-between items-center mx-auto max-w-6xl'>
        <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4'>
          <p className='text-sm text-gray-600'>© 2025 RestClient</p>
        </div>
        <div className='flex items-center space-x-4 mt-4 md:mt-0'>
          <Link
            href='https://github.com/author'
            className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
          >
            Author GitHub
          </Link>
          <Link
            href='https://example.com/course'
            className='flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors'
          >
            <div className='w-6 h-6 rounded flex items-center justify-center'>
              <Image src={CourseLogo} alt='' width={100} height={100} />
            </div>
            <span>Course</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
