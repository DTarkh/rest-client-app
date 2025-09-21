import { describe, it, expect } from 'vitest';
import HTTPSnippet from 'httpsnippet';

// We lightly exercise httpsnippet language targets used indirectly by our feature
// to raise coverage and ensure generators don't throw for a basic request.

describe('Code generators smoke', () => {
  const request = {
    method: 'GET',
    url: 'https://example.com/api',
    headers: [{ name: 'Accept', value: 'application/json' }],
    httpVersion: 'HTTP/1.1',
    cookies: [],
    queryString: [],
    postData: undefined,
    headersSize: -1,
    bodySize: -1,
  } as const;

  it('generates code snippets for several languages without raw variable placeholders', () => {
    // @ts-expect-error minimal shape for smoke test
    const snippet = new HTTPSnippet(request);
    const targets: [string, string][] = [
      ['shell', 'curl'],
      ['javascript', 'fetch'],
      ['python', 'requests'],
      ['java', 'okhttp'],
      ['go', 'native'],
      ['csharp', 'httpclient'],
    ];

    for (const [lang, client] of targets) {
      const code = snippet.convert(
        lang as unknown as string,
        client as unknown as string,
      ) as string;
      expect(code).toBeTruthy();
      expect(code).not.toContain('{{');
    }
  });
});
