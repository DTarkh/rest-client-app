'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { toast } from 'sonner';
import { logger } from '@/src/shared/lib/logger';

type CopyButtonProps = {
  code: string;
  language: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
};

export const CopyButton = ({
  code,
  language,
  variant = 'outline',
  size = 'sm',
}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      toast.success(`Код ${language} скопирован в буфер обмена`);

      // Сбрасываем состояние через 2 секунды
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Не удалось скопировать код');
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
          Скопировано
        </>
      ) : (
        <>
          <Copy size={16} />
          Копировать
        </>
      )}
    </Button>
  );
};
