import { logger } from '@/shared/lib/logger';
import type { HttpRequest, HttpMethod } from '../model/request.types';

function decodeB64UrlSafe(input: string): string {
  // 1) Undo percent-encoding (if present)
  let s = input;
  try {
    s = decodeURIComponent(input);
  } catch {
    // not percent-encoded; ignore
  }

  // 2) Convert base64url -> base64
  s = s.replace(/-/g, '+').replace(/_/g, '/');

  // 3) Re-pad to multiple of 4
  const mod = s.length % 4;
  if (mod) s += '='.repeat(4 - mod);

  // 4) Decode
  return atob(s);
}

export function decodeRequestFromUrl(params: string[], searchParams: URLSearchParams): HttpRequest {
  const [methodParam, encodedUrl, encodedBody] = params;

  const method = (methodParam?.toUpperCase() as HttpMethod) || 'GET';

  // URL
  let url = '';
  if (encodedUrl) {
    try {
      url = decodeB64UrlSafe(encodedUrl);
    } catch {
      // Fallbacks for robustness
      try {
        url = decodeURIComponent(encodedUrl);
      } catch {
        url = encodedUrl; // last resort
        logger('Failed to decode URL from parameters');
      }
    }
  }

  // Body
  let body = '';
  if (encodedBody) {
    try {
      body = decodeURIComponent(decodeB64UrlSafe(encodedBody));
    } catch {
      try {
        body = decodeURIComponent(encodedBody);
      } catch {
        body = '';
        logger('Failed to decode body from parameters');
      }
    }
  }

  // Headers from query params
  const headers = Array.from(searchParams.entries()).map(([key, value]) => ({
    id: crypto.randomUUID(),
    key,
    value,
    enabled: true,
  }));

  // Body type detection
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
