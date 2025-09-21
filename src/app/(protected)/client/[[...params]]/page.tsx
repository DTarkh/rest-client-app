'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useRequestStore } from '@/src/entities/http-request';
import { decodeRequestFromUrl } from '@/src/entities/http-request/';
import { logger } from '@/src/shared/lib/logger';

const ClientPage = dynamic(() => import('@/src/pages-slice/client-page').then(m => m.ClientPage), {
  ssr: false,
  loading: () => <div className='p-6 text-sm text-gray-600'>Loading…</div>,
});

export default function DynamicRestClientPage() {
  const routeParams = useParams() as { params?: string[] };
  const spHook = useSearchParams();
  const sp = useMemo(() => new URLSearchParams(spHook?.toString() ?? ''), [spHook]);

  const setMethod = useRequestStore(s => s.setMethod);
  const setUrl = useRequestStore(s => s.setUrl);
  const setHeaders = useRequestStore(s => s.setHeaders);
  const setBody = useRequestStore(s => s.setBody);
  const resetRequest = useRequestStore(s => s.resetRequest);

  useEffect(() => {
    if (routeParams?.params?.length) {
      try {
        const decoded = decodeRequestFromUrl(routeParams.params, sp);
        setMethod(decoded.method);
        setUrl(decoded.url);
        setHeaders(decoded.headers);
        setBody(decoded.body, decoded.bodyType === 'none' ? undefined : decoded.bodyType);
      } catch {
        logger('Failed to decode request from URL parameters');
      }
    }
    return () => resetRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeParams?.params, sp]);

  return <ClientPage />;
}
