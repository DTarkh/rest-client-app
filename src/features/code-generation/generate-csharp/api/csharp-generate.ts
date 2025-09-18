import type { HttpRequest } from '@/src/entities/http-request';

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

export class CSharpGenerator {
  static generate(request: HttpRequest): string {
    const method = (request.method || 'GET').toUpperCase();
    const url = ensureAbsoluteUrl(request.url || '');
    if (!url) return `// Недостаточно данных: укажите URL`;

    const headers = toEnabledHeadersArray(request.headers || []);
    const body = (request.body ?? '').trim();
    const ct = headerValue(headers, 'Content-Type') || (body ? 'application/json' : undefined);

    const hdrLines = headers
      .filter(h => h.key.toLowerCase() !== 'content-type')
      .map(
        h =>
          `client.DefaultRequestHeaders.Add("${h.key}", "${(h.value ?? '').replace(/"/g, '\\"')}");`,
      )
      .join('\n');

    const content =
      methodAllowsBody(method) && body
        ? `var content = new StringContent(${csString(body)}, System.Text.Encoding.UTF8, "${ct}");`
        : `HttpContent? content = null;`;

    return `// C# (HttpClient)
using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    using var client = new HttpClient();
${hdrLines ? '    ' + hdrLines + '\n' : ''}    ${content}
    var req = new HttpRequestMessage(HttpMethod.${csMethod(method)}, "${url}") {
      Content = ${methodAllowsBody(method) && body ? 'content' : 'null'}
    };
    var res = await client.SendAsync(req);
    string bodyStr = await res.Content.ReadAsStringAsync();
    Console.WriteLine(bodyStr);
  }
}
`;
  }
}

function csString(s: string) {
  return `@"${s.replace(/"/g, '""')}"`;
}
function csMethod(m: string) {
  switch (m) {
    case 'POST':
      return 'Post';
    case 'PUT':
      return 'Put';
    case 'PATCH':
      return 'Patch';
    case 'DELETE':
      return 'Delete';
    default:
      return 'Get';
  }
}
