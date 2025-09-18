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

export class JavaGenerator {
  static generate(request: HttpRequest): string {
    const method = (request.method || 'GET').toUpperCase();
    const url = ensureAbsoluteUrl(request.url || '');
    if (!url) return `// Недостаточно данных: укажите URL`;

    const headers = toEnabledHeadersArray(request.headers || []);
    const body = (request.body ?? '').trim();
    const ct = headerValue(headers, 'Content-Type') || (body ? 'application/json' : undefined);

    const hdrLines = headers
      .map(h => `      .addHeader("${h.key}", "${(h.value ?? '').replace(/"/g, '\\"')}")`)
      .join('\n');

    const requestBody =
      methodAllowsBody(method) && body
        ? `RequestBody body = RequestBody.create("${javaEscape(body)}", MediaType.parse("${ct}"));`
        : `RequestBody body = null;`;

    const methodLine =
      methodAllowsBody(method) && body
        ? `.method("${method}", body)`
        : `.method("${method}", null)`;

    return `// Java (OkHttp)
import okhttp3.*;

public class Main {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();
    ${requestBody}
    Request request = new Request.Builder()
      .url("${url}")
${hdrLines ? hdrLines + '\n' : ''}      ${methodLine}
      .build();

    try (Response response = client.newCall(request).execute()) {
      if (!response.isSuccessful()) throw new RuntimeException("Unexpected code " + response);
      String ct = response.header("content-type", "");
      String bodyStr = response.body().string();
      System.out.println(bodyStr);
    }
  }
}
`;
  }
}

function javaEscape(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}
