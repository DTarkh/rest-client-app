'use client';

import type { Metadata } from 'next';
import { VariablesManager } from '@/widgets/variable-manager/';
import { useI18n } from '../model/i18n';

export const metadata: Metadata = {
  title: 'Variables',
  description: 'Create variables to reuse values in HTTP requests',
};

export function VariablesPage() {
  const { t } = useI18n();

  return (
    <div className='p-8'>
      <div className='min-h-screen pt-20 md:pl-64'>
        <div className='container mx-auto py-8'>
          <div className='pb-25'>
            <div className='mb-8'>
              <h1 className='text-3xl font-bold text-gray-900 mb-4 pl-1.5'>{t('title')}</h1>
              <p className='text-gray-600 mt-2 pl-1.5'>{t('helpText')}</p>
            </div>

            <VariablesManager />
          </div>
        </div>
      </div>
    </div>
  );
}
