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

  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);

  useEffect(() => {
    setLocalValue(value);
    if (!value) {
      setTouched(false);
      setTriedSubmit(false);
    }
  }, [value]);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
    onChange(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isExecuting) {
      setTriedSubmit(true);
      handleBlur();
      onExecute();
    }
  };

  const shouldShowError = Boolean(error) && (touched || triedSubmit) && !isFocused;

  return (
    <div className='flex gap-2'>
      <div className='flex-1'>
        <Input
          value={localValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={t('urlPlaceholder') as string}
          className={`font-mono ${shouldShowError ? 'border-red-500' : ''}`}
          disabled={isExecuting}
        />
        {shouldShowError && <p className='text-sm text-red-500 mt-1'>{t(error as ErrorType)}</p>}
      </div>
      <Button
        onClick={() => {
          setTriedSubmit(true);
          onExecute();
        }}
        disabled={isExecuting || !localValue.trim()}
        className='gap-2'
      >
        <Send size={16} />
        {isExecuting ? t('sendingButton') : t('sendButton')}
      </Button>
    </div>
  );
};
