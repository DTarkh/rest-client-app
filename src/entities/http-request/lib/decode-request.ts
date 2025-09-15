import { logger } from '@/src/shared/lib/logger';
import { HttpRequest, HttpMethod } from '../model/request.types';

export function decodeRequestFromUrl(params: string[], searchParams: URLSearchParams): HttpRequest {
  const [methodParam, encodedUrl, encodedBody] = params;

  const method = (methodParam?.toUpperCase() as HttpMethod) || 'GET';

  let url = '';
  if (encodedUrl) {
    try {
      url = atob(encodedUrl);
    } catch {
      logger('Failed to decode URL from parameters');
    }
  }

  let body = '';
  if (encodedBody) {
    try {
      body = decodeURIComponent(atob(encodedBody));
    } catch {
      logger('Failed to decode body from parameters');
    }
  }

  const headers = Array.from(searchParams.entries()).map(([key, value]) => ({
    id: crypto.randomUUID(),
    key,
    value,
    enabled: true,
  }));

  let bodyType: 'json' | 'text' | 'none' = 'none';
  if (body.trim()) {
    try {
      JSON.parse(body);
      bodyType = 'json';
    } catch {
      bodyType = 'text';
    }
  }

  return {
    method,
    url,
    headers,
    body,
    bodyType,
    timestamp: Date.now(),
  };
}
