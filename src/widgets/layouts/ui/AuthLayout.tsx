'use client';
import type React from 'react';
import { Button } from '@/src/shared/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createI18nModule } from '@/src/shared/lib/i18n';

const useI18n = createI18nModule({
  backToHome: {
    en: 'Back to Home',
    ru: 'Назад на главную',
  },
});
export const AuthLayout = ({ formSlot }: { formSlot: React.ReactNode }) => {
  const { t } = useI18n();
  return (
    <div className='min-h-screen flex items-center justify-center flex-col gap-4  py-12 px-4 sm:px-6 lg:px-8'>
      <Link href='/'>
        <Button variant={'ghost'}>
          <ArrowLeft className='h-2 w-6 text-gray-600 hover:text-gray-900' />
          {t('backToHome')}
        </Button>
      </Link>
      {formSlot}
    </div>
  );
};
