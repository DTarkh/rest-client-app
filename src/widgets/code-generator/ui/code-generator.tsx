// src/widgets/code-generator/ui/code-generator.tsx
'use client';

import { useEffect } from 'react';
import { Card } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { Wand2, Download } from 'lucide-react';
import { useRequestStore } from '@/src/entities/http-request';
import {
  useCodeSnippetStore,
  SupportedLanguage,
  getLanguageConfig,
} from '@/src/entities/code-snippet';
import { useCodeGenerator } from '@/src/features/code-generation';
import { LanguageSelector } from './language-selector';
import { CodeViewer } from './code-viewer';
import { CopyButton } from './copy-button';
import { toast } from 'sonner';

export const CodeGenerator = () => {
  const { currentRequest, isValid } = useRequestStore();
  const { snippets, currentLanguage, isGenerating, setCurrentLanguage } = useCodeSnippetStore();

  const { mutate: generateCode } = useCodeGenerator();

  const currentSnippet = snippets[currentLanguage];

  // Автоматическая генерация при изменении запроса или языка
  useEffect(() => {
    if (isValid && currentRequest.url && currentRequest.method) {
      generateCode({
        request: currentRequest,
        language: currentLanguage,
      });
    }
  }, [currentRequest, currentLanguage, isValid, generateCode]);

  const handleLanguageChange = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
  };

  const handleManualGenerate = () => {
    if (!isValid) {
      toast.error('Заполните корректно URL и параметры запроса');
      return;
    }

    generateCode({
      request: currentRequest,
      language: currentLanguage,
    });
  };

  const downloadCode = () => {
    if (!currentSnippet?.code) return;

    const { extension, label } = getLanguageConfig(currentLanguage);
    const filename = `http-request.${extension}`;

    const blob = new Blob([currentSnippet.code], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Код ${label} сохранен как ${filename}`);
  };

  return (
    <div className='space-y-6'>
      <Card className='p-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold'>Генерация кода</h2>
            {currentSnippet?.code && (
              <div className='flex gap-2'>
                <CopyButton
                  code={currentSnippet.code}
                  language={getLanguageConfig(currentLanguage).label}
                />
                <Button variant='outline' size='sm' onClick={downloadCode} className='gap-2'>
                  <Download size={16} />
                  Скачать
                </Button>
              </div>
            )}
          </div>

          <div className='flex items-center justify-between'>
            <LanguageSelector
              selectedLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />

            <Button
              onClick={handleManualGenerate}
              disabled={!isValid || isGenerating}
              variant='outline'
              size='sm'
              className='gap-2'
            >
              <Wand2 size={16} />
              {isGenerating ? 'Генерируем...' : 'Обновить код'}
            </Button>
          </div>
        </div>
      </Card>

      <CodeViewer snippet={currentSnippet} isLoading={isGenerating} />
    </div>
  );
};
