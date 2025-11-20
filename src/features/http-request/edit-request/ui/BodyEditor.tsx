'use client';

import React from 'react';
import { FileText, Code, Wand2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Textarea } from '@/shared/ui/textarea';
import { useRequestBody } from '../model/use-request-body';
import { useI18n, type ErrorType } from '../model/i18n';

type BodyEditorProps = {
  body: string;
  bodyType: 'json' | 'text' | 'none';
  onChange: (body: string, type: 'json' | 'text' | 'none') => void;
  method: string;
  error?: string;
};

export const BodyEditor = ({ body, bodyType, onChange, method, error }: BodyEditorProps) => {
  const { t } = useI18n();

  const {
    body: localBody,
    bodyType: localBodyType,
    setBody,
    setBodyType,
    prettifyJson,
    isJsonValid,
  } = useRequestBody({
    initialBody: body,
    initialType: bodyType,
  });

  const bodyNotAllowed = ['GET', 'HEAD'].includes(method.toUpperCase());

  const handleTabChange = (value: string) => {
    const newType = value as 'json' | 'text' | 'none';
    setBodyType(newType);
    onChange(localBody, newType);
  };

  const handleBodyChange = (newBody: string, type: 'json' | 'text' | 'none') => {
    setBody(newBody, type);
    onChange(newBody, type);
  };

  if (bodyNotAllowed) {
    return (
      <div className='text-center py-8 text-gray-500' data-testid='body-not-allowed'>
        <FileText size={48} className='mx-auto mb-2 opacity-50' />
        <p className='text-sm text-gray-400'>
          {method} {t('methodNotSupported')}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4' data-testid='body-editor'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold'>{t('bodyTitle')}</h3>
        {localBodyType === 'json' && localBody.trim() && (
          <Button
            data-testid='prettify-json'
            onClick={prettifyJson}
            variant='outline'
            size='sm'
            className='gap-2'
          >
            <Wand2 size={16} />
            {t('formatJsonButton')}
          </Button>
        )}
      </div>

      <Tabs value={localBodyType} onValueChange={handleTabChange} data-testid='body-tabs'>
        <TabsList>
          <TabsTrigger value='none' className='gap-2' data-testid='tab-none'>
            {t('noBodyTab')}
          </TabsTrigger>
          <TabsTrigger value='json' className='gap-2' data-testid='tab-json'>
            <Code size={16} />
            JSON
          </TabsTrigger>
          <TabsTrigger value='text' className='gap-2' data-testid='tab-text'>
            <FileText size={16} />
            {t('textTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value='none'
          className='text-center py-8 text-gray-500'
          data-testid='panel-none'
        >
          <p>{t('noBodyMessage')}</p>
        </TabsContent>

        <TabsContent value='json' className='space-y-2' data-testid='panel-json'>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>application/json</Badge>
            {(error || !isJsonValid) && (
              <Badge variant='destructive'>
                {error ? t(error as ErrorType) : t('invalidJson')}
              </Badge>
            )}
          </div>
          <Textarea
            data-testid='json-body-textarea'
            value={localBody}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleBodyChange(e.target.value, 'json')
            }
            placeholder={t('jsonPlaceholder') as string}
            className={`min-h-[200px] font-mono ${error || !isJsonValid ? 'border-red-500' : ''}`}
            spellCheck={false}
          />
          {(error || !isJsonValid) && (
            <p className='text-sm text-red-500'>
              {error ? t(error as ErrorType) : t('invalidJson')}
            </p>
          )}
        </TabsContent>

        <TabsContent value='text' className='space-y-2' data-testid='panel-text'>
          <Badge variant='secondary'>text/plain</Badge>
          <Textarea
            data-testid='text-body-textarea'
            value={localBody}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleBodyChange(e.target.value, 'text')
            }
            placeholder={t('textPlaceholder') as string}
            className='min-h-[200px]'
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
