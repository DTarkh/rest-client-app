'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { toast } from 'sonner';
import { logger } from '@/src/shared/lib/logger';
import { useI18n } from '../model/i18n';

type CopyButtonProps = {
  code: string;
  language: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
};

export const CopyButton = ({ code, variant = 'outline', size = 'sm' }: CopyButtonProps) => {
  const { t } = useI18n();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      const message = t('copySuccess');
      toast.success(message);

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error(t('copyError'));
      logger('Copy failed:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      disabled={!code.trim()}
      className='gap-2'
    >
      {isCopied ? (
        <>
          <Check size={16} className='text-green-600' />
          {t('copiedButton')}
        </>
      ) : (
        <>
          <Copy size={16} />
          {t('copyButton')}
        </>
      )}
    </Button>
  );
};
