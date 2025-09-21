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

export class PythonRequestsGenerator {
  static generate(request: HttpRequest): string {
    const method = (request.method || 'GET').toUpperCase();
    const url = ensureAbsoluteUrl(request.url || '');
    if (!url) return `# Недостаточно данных: укажите URL`;

    const headers = toEnabledHeadersArray(request.headers || []);
    const body = (request.body ?? '').trim();

    const hdrObject: Record<string, string> = {};
    headers.forEach(h => {
      hdrObject[h.key] = h.value ?? '';
    });

    const bodyLine =
      methodAllowsBody(method) && body ? `data = ${guessPyBody(body)}\n` : `data = None\n`;

    return `# Python requests
import requests

url = "${url}"
headers = ${pyDict(hdrObject)}
${bodyLine}
response = requests.request("${method}", url, headers=headers, data=data)
try:
    response.raise_for_status()
    ct = response.headers.get("content-type", "")
    print("Success:", response.json() if "application/json" in ct else response.text)
except Exception as e:
    print("Error:", e)

`;
  }
}

function pyDict(obj: Record<string, string>): string {
  const items = Object.entries(obj).map(([k, v]) => {
    const safeValue = (v ?? '').replace(/"/g, '\\"');
    return `"${k}": "${safeValue}"`;
  });
  return `{${items.join(', ')}}`;
}

function guessPyBody(raw: string): string {
  try {
    JSON.parse(raw);
    return `json=${raw}`;
  } catch {
    const safe = raw.replace(/"""/g, '\\"\\"\\"');
    return `"""${safe}"""`;
  }
}
