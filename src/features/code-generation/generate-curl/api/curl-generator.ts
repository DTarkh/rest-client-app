import type { HttpRequest } from '@/src/entities/http-request';

export type HeaderKV = { key: string; value: string; enabled?: boolean };

/** Ensure URL has http/https so code samples work even if user typed "api.example.com" */
export function ensureAbsoluteUrl(url: string): string {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^\/\//, '')}`;
}

/** Keep only enabled, non-empty headers */
export function toEnabledHeadersArray(headers: HeaderKV[] = []): HeaderKV[] {
  return headers.filter(h => h?.key?.trim() && h.enabled !== false);
}

/** Methods that can legally carry a body */
export function methodAllowsBody(m: string): boolean {
  const mm = (m || '').toUpperCase();
  return mm === 'POST' || mm === 'PUT' || mm === 'PATCH' || mm === 'DELETE';
}

/** Find a header's value by (case-insensitive) name */
export function headerValue(headers: HeaderKV[], name: string): string | undefined {
  const h = headers.find(x => x.key.toLowerCase() === name.toLowerCase());
  return h?.value;
}

/** Shell-safe single-quoted string: ' -> '\''  (POSIX-safe) */
export function shellQuoteSingle(str: string): string {
  return `'${String(str).replace(/'/g, `'\\''`)}'`;
}

/** Try to produce a nice-looking body for cURL --data ... */
export function normalizeBodyForCurl(raw: string, contentType?: string): string {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return '';

  const ct = (contentType || '').toLowerCase();
  if (ct.includes('application/json')) {
    try {
      const parsed = JSON.parse(trimmed);
      return JSON.stringify(parsed);
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

/** Convert headers array to a Record; useful for Node/Fetch generators too */
export function headersToRecord(headers: HeaderKV[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const h of headers) out[h.key] = h.value ?? '';
  return out;
}

export class CurlGenerator {
  static generate(request: HttpRequest): string {
    const method = (request.method || 'GET').toUpperCase();
    const url = ensureAbsoluteUrl(request.url || '');

    if (!url || !method) {
      return '# Недостаточно данных: укажите URL и HTTP метод';
    }

    const headers = toEnabledHeadersArray(request.headers || []);
    const contentType = headerValue(headers, 'Content-Type');
    const rawBody = (request.body ?? '').trim();

    const lines: string[] = [];
    lines.push(`curl -X ${method} ${shellQuoteSingle(url)}`);

    for (const h of headers) {
      lines.push(`  -H ${shellQuoteSingle(`${h.key}: ${h.value ?? ''}`)}`);
    }

    if (methodAllowsBody(method) && rawBody) {
      const bodyText = normalizeBodyForCurl(rawBody, contentType);
      lines.push(`  --data ${shellQuoteSingle(bodyText)}`);
    }

    return lines.join(' \\\n');
  }
}
