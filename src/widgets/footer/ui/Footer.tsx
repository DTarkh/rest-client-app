'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useI18n } from '../model/i18n';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className='py-5 px-4 border-t border-gray-200 bg-white'>
      <div className='flex flex-col md:flex-row items-center justify-between mx-auto max-w-6xl gap-3'>
        <p className='text-sm text-gray-600'>{t('footerCopyright')}</p>

        <div className='flex items-center'>
          <div className='flex gap-2 items-center'>
            <span className='text-gray-600 text-sm'>{t('footerAuthorsLabel')}</span>
            <Link
              href='https://github.com/lnrzhkv'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
            >
              {t('authorAlina')}
            </Link>
            <Link
              href='https://github.com/DTarkh'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
            >
              {t('authorDavid')}
            </Link>
          </div>
        </div>

        <Link
          href='https://rs.school/courses/reactjs'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors'
        >
          <div className='w-6 h-6 rounded flex items-center justify-center'>
            <Image src='rss-logo.svg' alt='logo' width={100} height={100} />
          </div>
          <span>{t('footerViewCourse')}</span>
        </Link>
      </div>
    </footer>
  );
}
