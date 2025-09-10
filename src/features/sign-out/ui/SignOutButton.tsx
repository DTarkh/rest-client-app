'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { useSignOut } from '../model/use-sign-out';
import { useI18n } from '../model/i18n';

type SignOutButtonProps = {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
};

export const SignOutButton = ({ variant = 'outline', size = 'default' }: SignOutButtonProps) => {
  const { mutate: signOut, isPending } = useSignOut();
  const { t } = useI18n();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => signOut()}
      disabled={isPending}
      className='gap-2'
    >
      <LogOut size={16} />
      {isPending ? t('loggingOut') : t('logout')}
    </Button>
  );
};
