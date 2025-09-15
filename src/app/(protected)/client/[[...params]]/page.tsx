'use client';

import { use, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRequestStore } from '@/src/entities/http-request';
import { decodeRequestFromUrl } from '@/src/entities/http-request/';
import { ClientPage } from '../../../../pages-slice/client-page';
import { logger } from '../../../../shared/lib/logger';

type Props = {
  params: Promise<{ params: string[] }>;
};

export default function DynamicRestClientPage({ params }: Props) {
  const searchParams = useSearchParams();
  const setMethod = useRequestStore(s => s.setMethod);
  const setUrl = useRequestStore(s => s.setUrl);
  const setHeaders = useRequestStore(s => s.setHeaders);
  const setBody = useRequestStore(s => s.setBody);
  const resetRequest = useRequestStore(s => s.resetRequest);
  const requestParams = use(params);

  useEffect(() => {
    if (requestParams.params?.length) {
      try {
        const decodedRequest = decodeRequestFromUrl(requestParams.params, searchParams);

        setMethod(decodedRequest.method);
        setUrl(decodedRequest.url);
        setHeaders(decodedRequest.headers);
        setBody(
          decodedRequest.body,
          decodedRequest.bodyType === 'none' ? undefined : decodedRequest.bodyType,
        );
      } catch {
        logger('Failed to decode request from URL parameters');
      }
    }

    return () => {
      resetRequest();
    };
  }, [requestParams.params, searchParams, setMethod, setUrl, setHeaders, setBody, resetRequest]);

  return <ClientPage />;
}
