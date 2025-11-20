import { HttpRequest } from '@/entities/http-request';

export class FetchGenerator {
  static generate(request: HttpRequest): string {
    const { method, url, headers, body } = request;

    if (!url || !method) {
      return `// Недостаточно данных: укажите URL и HTTP метод`;
    }

    try {
      const methodUpper = method.toUpperCase();
      const enabledHeaders = Array.isArray(headers)
        ? headers.filter(h => h.enabled !== false && h.key?.trim())
        : [];

      const headerLines = enabledHeaders
        .map(h => `    "${h.key}": "${(h.value ?? '').replace(/"/g, '\\"')}"`)
        .join(',\n');

      const headersBlock = headerLines ? `headers: {\n${headerLines}\n  },` : '';

      const bodyBlock =
        body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(methodUpper)
          ? `body: ${this.guessBody(body)},`
          : '';

      return `// JavaScript Fetch
fetch("${url}", {
  method: "${methodUpper}",
  ${headersBlock ? headersBlock + '\n  ' : ''}${bodyBlock}
})
  .then(response => {
    if (!response.ok) throw new Error(\`HTTP error \${response.status}\`);
    const ct = response.headers.get("content-type") || "";
    return ct.includes("application/json") ? response.json() : response.text();
  })
  .then(data => console.log("Success:", data))
  .catch(err => console.error("Error:", err));`;
    } catch (error) {
      return `// Ошибка генерации Fetch кода: ${error}`;
    }
  }

  private static guessBody(raw: string): string {
    try {
      const parsed = JSON.parse(raw);
      return `JSON.stringify(${JSON.stringify(parsed, null, 2)})`;
    } catch {
      return `\`${raw.replace(/`/g, '\\`')}\``;
    }
  }
}
