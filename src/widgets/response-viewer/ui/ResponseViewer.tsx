'use client';

import { useMemo, useRef } from 'react';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/src/shared/ui/badge';
import { useResponseStore } from '@/src/entities/http-response';
import { Card } from '@/src/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/ui/tabs';
import { Button } from '@/src/shared/ui/button';
import { useI18n } from '../../response-viewer/model/i18n';

const StatusBadge = ({ status }: { status: number }) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 300 && status < 400) return 'bg-yellow-100 text-yellow-800';
    if (status >= 400 && status < 500) return 'bg-orange-100 text-orange-800';
    if (status >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return <Badge className={getStatusColor(status)}>{status}</Badge>;
};

export const ResponseViewer = () => {
  const { response, isLoading, error } = useResponseStore();
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const { t } = useI18n();

  const formattedResponse = useMemo(() => {
    if (!response?.data) return '';

    try {
      if (typeof response.data === 'object') {
        return JSON.stringify(response.data, null, 2);
      }
      return String(response.data);
    } catch {
      return String(response.data);
    }
  }, [response?.data]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('copiedToClipboard'));
  };

  const downloadResponse = () => {
    if (!response || !downloadLinkRef.current) return;

    const blob = new Blob([formattedResponse], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    downloadLinkRef.current.href = url;
    downloadLinkRef.current.download = `response-${Date.now()}.json`;
    downloadLinkRef.current.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  if (isLoading) {
    return (
      <Card className='p-6'>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center space-y-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='text-gray-500'>{t('executingRequest')}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='p-6 border-red-200'>
        <div className='text-center py-12 space-y-4'>
          <div className='text-red-500 text-xl'>⚠️</div>
          <h3 className='text-lg font-semibold text-red-700'>{t('requestError')}</h3>
          <p className='text-red-600'>{error}</p>
          <div className='text-sm text-gray-600 mt-4'>
            <p>{t('possibleReasons')}</p>
            <ul className='list-disc list-inside mt-2'>
              <li>{t('invalidUrl')}</li>
              <li>{t('networkIssues')}</li>
              <li>{t('corsRestrictions')}</li>
            </ul>
          </div>
        </div>
      </Card>
    );
  }

  if (!response) {
    return (
      <Card className='p-6'>
        <div className='text-center py-12 text-gray-500'>
          <div className='text-4xl mb-4'>🚀</div>
          <h3 className='text-lg font-semibold'>{t('readyToRequest')}</h3>
          <p>{t('enterUrlHint')}</p>
        </div>
      </Card>
    );
  }

  const headersCount = Object.keys(response.headers).length;

  return (
    <Card className='p-6'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <h3 className='text-lg font-semibold'>{t('responseTitle')}</h3>
            <div className='flex items-center gap-2'>
              <StatusBadge status={response.status} />
              <span className='text-sm text-gray-600'>{response.statusText}</span>
            </div>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <span>{response.duration}ms</span>
            <span>•</span>
            <span>
              {(response.size / 1024).toFixed(1)} {t('responseSize')}
            </span>
          </div>
        </div>

        <Tabs defaultValue='body' className='w-full'>
          <TabsList>
            <TabsTrigger value='body'>{t('responseBody')}</TabsTrigger>
            <TabsTrigger value='headers'>
              {t('headersTab')} ({headersCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='body' className='space-y-4'>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => copyToClipboard(formattedResponse)}
                className='gap-2'
              >
                <Copy size={16} />
                {t('copyButton')}
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={downloadResponse}
                className='gap-2'
                asChild
              >
                <a ref={downloadLinkRef}>
                  <Download size={16} />
                  {t('downloadButton')}
                </a>
              </Button>
            </div>

            <div className='relative'>
              <pre className='bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-sm'>
                <code>{formattedResponse}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value='headers' className='space-y-2'>
            <div className='bg-gray-50 rounded-lg p-4'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left py-2 font-semibold'>{t('headersTab')}</th>
                    <th className='text-left py-2 font-semibold'>{t('headerValuePlaceholder')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <tr key={key} className='border-b border-gray-200'>
                      <td className='py-2 font-mono text-gray-700'>{key}</td>
                      <td className='py-2 font-mono break-all'>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
