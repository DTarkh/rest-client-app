'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Card } from '@/src/shared/ui/card';
import { Badge } from '@/src/shared/ui/badge';
import { Prism } from '@/src/shared/lib/prism-config';
import { CodeSnippet } from '@/src/entities/code-snippet';
import { logger } from '@/src/shared/lib/logger';
import { useI18n } from '../model/i18n';

type CodeViewerProps = {
  snippet: CodeSnippet | null;
  isLoading?: boolean;
};

export const CodeViewer = ({ snippet, isLoading }: CodeViewerProps) => {
  const { t } = useI18n();
  const codeRef = useRef<HTMLElement>(null);

  const highlightedCode = useMemo(() => {
    if (!snippet?.code || !snippet.prismLanguage) return '';

    try {
      return Prism.highlight(
        snippet.code,
        Prism.languages[snippet.prismLanguage] || Prism.languages.text,
        snippet.prismLanguage,
      );
    } catch (error) {
      logger('Ошибка подсветки синтаксиса:', error);
      return snippet.code;
    }
  }, [snippet?.code, snippet?.prismLanguage]);

  useEffect(() => {
    if (codeRef.current && highlightedCode) {
      codeRef.current.innerHTML = highlightedCode;
    }
  }, [highlightedCode]);

  if (isLoading) {
    return (
      <Card className='p-6'>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center space-y-4'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='text-gray-500'>{t('loadingText')}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!snippet) {
    return (
      <Card className='p-6'>
        <div className='text-center py-12 text-gray-500'>
          <div className='text-4xl mb-4'>💻</div>
          <h3 className='text-lg font-semibold'>{t('generationTitle')}</h3>
          <p>{t('generationDescription')}</p>
        </div>
      </Card>
    );
  }

  if (snippet.error) {
    return (
      <Card className='p-6 border-red-200'>
        <div className='text-center py-12 space-y-4'>
          <div className='text-red-500 text-xl'>⚠️</div>
          <h3 className='text-lg font-semibold text-red-700'>{t('errorTitle')}</h3>
          <p className='text-red-600'>{snippet.error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='p-6'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h3 className='text-lg font-semibold'>{t('generatedCodeTitle')}</h3>
            <Badge variant='secondary' className='gap-1'>
              <span>{snippet.language}</span>
            </Badge>
          </div>
          <div className='text-sm text-gray-500'>
            {new Date(snippet.generatedAt).toLocaleTimeString()}
          </div>
        </div>

        <div className='code-viewer'>
          <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96'>
            <code ref={codeRef}>{snippet.code}</code>
          </pre>
        </div>
      </div>
    </Card>
  );
};
