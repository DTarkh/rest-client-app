'use client';

import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { Input } from '@/src/shared/ui/input';
import { useI18n, type ErrorType } from '../model/i18n';

type UrlInputProps = {
  value: string;
  onChange: (url: string) => void;
  onExecute: () => void;
  isExecuting?: boolean;
  error?: string;
};

export const UrlInput = ({
  value,
  onChange,
  onExecute,
  isExecuting = false,
  error,
}: UrlInputProps) => {
  const { t } = useI18n();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    onChange(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isExecuting) {
      handleBlur();
      onExecute();
    }
  };

  return (
    <div className='flex gap-2'>
      <div className='flex-1'>
        <Input
          value={localValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={t('urlPlaceholder') as string}
          className={`font-mono ${error ? 'border-red-500' : ''}`}
          disabled={isExecuting}
        />
        {error && <p className='text-sm text-red-500 mt-1'>{t(error as ErrorType)}</p>}
      </div>
      <Button onClick={onExecute} disabled={isExecuting || !localValue.trim()} className='gap-2'>
        <Send size={16} />
        {isExecuting ? t('sendingButton') : t('sendButton')}
      </Button>
    </div>
  );
};
