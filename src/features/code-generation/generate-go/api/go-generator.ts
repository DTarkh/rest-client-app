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

export class GoGenerator {
  static generate(request: HttpRequest): string {
    const method = (request.method || 'GET').toUpperCase();
    const url = ensureAbsoluteUrl(request.url || '');
    if (!url) return `// Недостаточно данных: укажите URL`;

    const headers = toEnabledHeadersArray(request.headers || []);
    const body = (request.body ?? '').trim();

    const bodyLine =
      methodAllowsBody(method) && body
        ? `payload := strings.NewReader(${goString(body)})`
        : `var payload *strings.Reader = nil`;

    const hdrLines = headers
      .map(h => `req.Header.Set("${h.key}", "${(h.value ?? '').replace(/"/g, '\\"')}")`)
      .join('\n\t');

    return `// Go (net/http)
package main

import (
  "fmt"
  "io"
  "net/http"
  "strings"
)

func main() {
  ${bodyLine}
  req, err := http.NewRequest("${method}", "${url}", ${methodAllowsBody(method) && body ? 'payload' : 'nil'})
  if err != nil { panic(err) }
  ${hdrLines ? '\t' + hdrLines + '\n' : ''}

  res, err := http.DefaultClient.Do(req)
  if err != nil { panic(err) }
  defer res.Body.Close()

  b, _ := io.ReadAll(res.Body)
  fmt.Println(string(b))
}
`;
  }
}

function goString(s: string) {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}
