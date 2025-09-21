import type { HttpRequest } from '@/entities/http-request';

export type HeaderKV = { key: string; value: string; enabled?: boolean };

export function ensureAbsoluteUrl(url: string): string {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^\/\//, '')}`;
}

export function toEnabledHeadersArray(headers: HeaderKV[] = []) {
  return headers.filter(h => h?.key?.trim() && h.enabled !== false);
}

export function methodAllowsBody(m: string) {
  const mm = (m || '').toUpperCase();
  return mm === 'POST' || mm === 'PUT' || mm === 'PATCH' || mm === 'DELETE';
}

export function headerValue(headers: HeaderKV[], name: string): string | undefined {
  const h = headers.find(x => x.key.toLowerCase() === name.toLowerCase());
  return h?.value;
}

export class NodeJsGenerator {
  static generate(request: HttpRequest): string {
    const method = (request.method || 'GET').toUpperCase();
    const url = ensureAbsoluteUrl(request.url || '');
    if (!url) return `// Недостаточно данных: укажите URL`;

    const headers = toEnabledHeadersArray(request.headers || []);
    const body = (request.body ?? '').trim();

    const hdrObject: Record<string, string> = {};
    headers.forEach(h => {
      hdrObject[h.key] = h.value ?? '';
    });

    const dataDecl =
      methodAllowsBody(method) && body ? `const data = ${JSON.stringify(body)};\n\n` : '';

    return `// Node.js native https
const https = require('https');

${dataDecl}const options = {
  method: '${method}',
  headers: ${JSON.stringify(hdrObject, null, 2)}
};

const req = https.request('${url}', options, (res) => {
  let chunks = '';
  res.on('data', d => chunks += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const ct = res.headers['content-type'] || '';
    try {
      console.log('Body:', ct.includes('application/json') ? JSON.parse(chunks) : chunks);
    } catch {
      console.log('Body:', chunks);
    }
  });
});

req.on('error', (e) => console.error('Error:', e));
${methodAllowsBody(method) && body ? 'req.write(data);\n' : ''}req.end();
`;
  }
}
