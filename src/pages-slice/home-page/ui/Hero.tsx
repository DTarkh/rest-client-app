'use client';
import { routes } from '@/src/shared/constants';
import Link from 'next/link';
import { createI18nModule } from '@/src/shared/lib/i18n';
import { heroTranslations } from '../i18n';

const useI18n = createI18nModule(heroTranslations);

export function Hero() {
  const { t } = useI18n();

  return (
    <section className='pt-50 pb-20 px-4'>
      <div className='container mx-auto max-w-6xl text-center'>
        <span className='inline-block mb-4 px-3 py-1 text-sm bg-gray-100 text-gray-700 border border-gray-200 rounded-full'>
          {t('label')}
        </span>

        <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance'>
          {t('title')}
        </h1>

        <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty'>
          {t('description')}
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link href={routes.client} className='btn'>
            {t('button')} <span className='ml-2'>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
