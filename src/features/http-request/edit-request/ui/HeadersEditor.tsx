'use client';

import { Plus, Trash2 } from 'lucide-react';
import type React from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@radix-ui/react-checkbox';
import { useI18n, type ErrorType } from '../model/i18n';

export type HeaderEntry = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

type HeadersEditorProps = {
  headers: HeaderEntry[];
  onChange: (headers: HeaderEntry[]) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  validationErrors?: Record<string, string>;
};

export const HeadersEditor = ({
  headers,
  onChange,
  onAdd,
  onRemove,
  onToggle,
  validationErrors = {},
}: HeadersEditorProps) => {
  const { t } = useI18n();

  const updateHeader = (id: string, field: 'key' | 'value', newValue: string) => {
    const updatedHeaders = headers.map(header =>
      header.id === id ? { ...header, [field]: newValue } : header,
    );
    onChange(updatedHeaders);
  };

  const commonHeaders = ['Content-Type', 'Authorization', 'Accept', 'User-Agent', 'Cache-Control'];

  const getHeaderError = (headerId: string): string | undefined => {
    return validationErrors[`header-${headerId}`];
  };

  return (
    <div className='space-y-4' data-testid='headers-editor'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold'>{t('headersTitle')}</h3>
        <Button
          onClick={onAdd}
          variant='outline'
          size='sm'
          className='gap-2'
          data-testid='add-header'
        >
          <Plus size={16} />
          {t('addHeaderButton')}
        </Button>
      </div>

      {headers.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <p>{t('noHeadersMessage')}</p>
          <p className='text-sm'>{t('addHeaderHint')}</p>
        </div>
      ) : (
        <div className='space-y-2' data-testid='headers-list'>
          {headers.map(header => {
            const error = getHeaderError(header.id);

            return (
              <div
                key={header.id}
                className='flex items-center gap-2 p-3 border rounded-lg'
                data-testid='header-row'
              >
                <Checkbox checked={header.enabled} onCheckedChange={() => onToggle(header.id)} />

                <div className='flex-1 grid grid-cols-2 gap-2'>
                  <div className='space-y-1'>
                    <Input
                      data-testid={`header-key-${header.id}`}
                      value={header.key}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateHeader(header.id, 'key', e.target.value)
                      }
                      placeholder={t('headerKeyPlaceholder') as string}
                      list={`common-headers-${header.id}`}
                      className={!header.enabled ? 'opacity-50' : ''}
                      disabled={!header.enabled}
                    />
                    <datalist id={`common-headers-${header.id}`}>
                      {commonHeaders.map(name => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </div>

                  <div className='space-y-1'>
                    <Input
                      data-testid={`header-value-${header.id}`}
                      value={header.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateHeader(header.id, 'value', e.target.value)
                      }
                      placeholder={t('headerValuePlaceholder') as string}
                      className={!header.enabled ? 'opacity-50' : ''}
                      disabled={!header.enabled}
                    />
                    {error && <p className='text-sm text-red-500'>{t(error as ErrorType)}</p>}
                  </div>
                </div>

                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onRemove(header.id)}
                  className='text-red-500 hover:text-red-700'
                  data-testid={`remove-header-${header.id}`}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
