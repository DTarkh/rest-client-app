'use client';
import { encodeRequestToUrl, useRequestStore } from '@/src/entities/http-request';
import { Card } from '@/src/shared/ui/card';
import { BodyEditor, HeadersEditor, MethodSelector, UrlInput } from '@/src/features/http-request';
import { useExecuteRequest } from '@/src/features/http-request/';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/ui/tabs';
import { useRouter } from 'next/navigation';
import { useI18n } from '../model/i18n';
import { useVariableSubstitution } from '@/src/entities/variable';

export const RequestBuilder = () => {
  const router = useRouter();
  const { t } = useI18n();

  const {
    currentRequest,
    isValid,
    validationErrors,
    setMethod,
    setUrl,
    setHeaders,
    setBody: setBodyFromStore,
    addHeader,
    removeHeader,
    toggleHeader,
  } = useRequestStore();

  const { processedRequest } = useVariableSubstitution(currentRequest);
  const { mutateAsync: executeRequest, isPending } = useExecuteRequest();

  const handleBodyChange = (body: string, type: 'json' | 'text' | 'none') => {
    setBodyFromStore(body, type === 'none' ? undefined : type);
  };

  const handleExecuteRequest = async () => {
    if (!isValid) return;

    const enabledHeaders = processedRequest.headers
      .filter(h => h.enabled && h.key.trim())
      .reduce(
        (acc, h) => {
          acc[h.key] = h.value;
          return acc;
        },
        {} as Record<string, string>,
      );

    const resolvedUrl = processedRequest.url?.trim();
    if (!resolvedUrl) return;

    const finalBody = processedRequest.bodyType === 'none' ? undefined : processedRequest.body;

    const executionPayload = {
      ...processedRequest,
      url: resolvedUrl,
      headers: enabledHeaders,
      body: finalBody,
    };

    await executeRequest(executionPayload);
    const encodedUrl = encodeRequestToUrl(currentRequest);
    router.replace(encodedUrl);
  };

  const enabledHeadersCount = currentRequest.headers.filter(h => h.enabled).length;
  const hasBody = currentRequest.body.trim();

  return (
    <div>
      <Card className='p-6'>
        <div className='space-y-4'>
          <div className='flex gap-4'>
            <MethodSelector value={currentRequest.method} onChange={setMethod} />
            <div className='flex-1'>
              <UrlInput
                value={currentRequest.url}
                onChange={setUrl}
                onExecute={handleExecuteRequest}
                isExecuting={isPending}
                error={validationErrors.url}
              />
            </div>
          </div>

          <Tabs defaultValue='headers' className='w-full'>
            <TabsList>
              <TabsTrigger value='headers' className='gap-2'>
                {t('headersTitle')}
                {enabledHeadersCount > 0 && (
                  <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                    {enabledHeadersCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value='body' className='gap-2'>
                {t('bodyTitle')}
                {hasBody && (
                  <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'>
                    {currentRequest.bodyType}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value='headers' className='mt-6'>
              <HeadersEditor
                headers={currentRequest.headers}
                onChange={setHeaders}
                onAdd={addHeader}
                onRemove={removeHeader}
                onToggle={toggleHeader}
                validationErrors={validationErrors}
              />
            </TabsContent>

            <TabsContent value='body' className='mt-6'>
              <BodyEditor
                body={currentRequest.body}
                bodyType={currentRequest.bodyType}
                method={currentRequest.method}
                onChange={handleBodyChange}
                error={validationErrors.body}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};
