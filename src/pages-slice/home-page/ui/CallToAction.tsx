'use client';
import { routes } from '@/src/shared/constants';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createI18nModule } from '@/src/shared/lib/i18n';
import { callToActionTranslations } from '../i18n';

export const useI18n = createI18nModule(callToActionTranslations);

export function CallToAction() {
  const { t } = useI18n();

  return (
    <section className='py-20 px-4'>
      <div className='container mx-auto max-w-4xl text-center'>
        <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>{t('title')}</h2>
        <p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>{t('description')}</p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link href={routes.client}>
            <button className='btn-outline'>
              {t('button')}
              <ArrowRight className='ml-2 h-4 w-4' />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
