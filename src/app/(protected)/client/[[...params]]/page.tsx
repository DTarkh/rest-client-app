// src/app/(protected)/client/[[...params]]/page.tsx
'use client';

import { use, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRequestStore } from '@/src/entities/http-request';
import { decodeRequestFromUrl } from '@/src/entities/http-request/';
import { ClientPage } from '../../../../pages-slice/client-page';
import { logger } from '../../../../shared/lib/logger';

type Props = { params: Promise<{ params: string[] }> };

export default function DynamicRestClientPage({ params }: Props) {
  const searchParams = useSearchParams(); // ReadonlyURLSearchParams
  const sp = useMemo(() => new URLSearchParams(searchParams?.toString() ?? ''), [searchParams]);

  const setMethod = useRequestStore(s => s.setMethod);
  const setUrl = useRequestStore(s => s.setUrl);
  const setHeaders = useRequestStore(s => s.setHeaders);
  const setBody = useRequestStore(s => s.setBody);
  const resetRequest = useRequestStore(s => s.resetRequest);
  const requestParams = use(params);

  useEffect(() => {
    if (requestParams.params?.length) {
      try {
        const decodedRequest = decodeRequestFromUrl(requestParams.params, sp);

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
    return () => resetRequest();
  }, [requestParams.params, sp, setMethod, setUrl, setHeaders, setBody, resetRequest]);

  return <ClientPage />;
}
