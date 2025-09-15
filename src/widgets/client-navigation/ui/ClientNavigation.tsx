'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import ActiveLink from '@/src/shared/ui/active-link';
import { routes } from '@/src/shared/constants';
import { UpdateLang } from '@/src/features/i18n';
import { Menu, X } from 'lucide-react';
import { useI18n } from '../model/i18n';

export function ClientNavigation() {
  const { t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <div className='w-full flex justify-between items-center h-20 bg-white px-4 fixed border-b '>
        <Link href='/' className='flex items-center gap-3 h-[70px] w-[160px]'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white'>
            <span className='text-xs font-bold'>RC</span>
          </div>
          <span className='text-xl font-bold text-foreground'>RestClient</span>
        </Link>
        <div className='flex items-center gap-3'>
          <UpdateLang />
          <button className='md:hidden p-2' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className='w-6 h-6 text-foreground' />
            ) : (
              <Menu className='w-6 h-6 text-foreground' />
            )}
          </button>
        </div>
      </div>

      <aside className='max-md:hidden w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-20 z-40'>
        <nav className='p-4'>
          <ul className='space-y-2'>
            <li>
              <ActiveLink href={routes.client}>⚡ {t('client')}</ActiveLink>
            </li>
            <li>
              <ActiveLink href={routes.variables}>🌐 {t('variables')}</ActiveLink>
            </li>
            <li>
              <ActiveLink href={routes.history}>🕒 {t('history')}</ActiveLink>
            </li>
          </ul>
        </nav>
      </aside>

      {isMobileMenuOpen && (
        <div className='md:hidden py-4 border-t border-border/20 px-5 fixed top-20 bg-white'>
          <nav className='flex flex-col space-y-4'>
            <Link
              onClick={() => setIsMobileMenuOpen(false)}
              href={routes.client}
              className='text-sm font-medium hover:text-gray-600 transition-colors
                 text-gray-800'
            >
              ⚡ {t('client')}
            </Link>
            <Link
              onClick={() => setIsMobileMenuOpen(false)}
              href={routes.variables}
              className='text-sm font-medium  hover:text-gray-600 transition-colors text-gray-800'
            >
              🌐 {t('variables')}
            </Link>
            <Link
              onClick={() => setIsMobileMenuOpen(false)}
              href={routes.history}
              className='text-sm font-medium  hover:text-gray-600 transition-colors  text-gray-800'
            >
              🕒 {t('history')}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
