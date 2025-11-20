import { HttpRequest } from '@/entities/http-request';
import { SupportedLanguage } from '@/entities/code-snippet';
import { CurlGenerator } from '../../generate-curl/api/curl-generator';
import { FetchGenerator } from '../../generate-javascript/api/fetch-generator';
import { PythonRequestsGenerator } from '../../generate-python/api/requests-generator';
import { NodeJsGenerator } from '../../generate-node/api/node-generator';
import { JavaGenerator } from '../../generate-java/api/java-generator';
import { CSharpGenerator } from '../../generate-csharp/api/csharp-generate';
import { GoGenerator } from '../../generate-go/api/go-generator';

export class CodeGenerator {
  static generate(request: HttpRequest, language: SupportedLanguage): string {
    try {
      switch (language) {
        case 'curl':
          return CurlGenerator.generate(request);

        case 'javascript-fetch':
          return FetchGenerator.generate(request);

        case 'javascript-xhr':
          return this.generateXHR(request);

        case 'nodejs':
          return NodeJsGenerator.generate(request);

        case 'python':
          return PythonRequestsGenerator.generate(request);

        case 'java':
          return JavaGenerator.generate(request);

        case 'csharp':
          return CSharpGenerator.generate(request);

        case 'go':
          return GoGenerator.generate(request);

        default:
          return `// Генератор для языка "${language}" еще не реализован`;
      }
    } catch (error) {
      return `// Ошибка генерации кода: ${error}`;
    }
  }

  private static generateXHR(request: HttpRequest): string {
    const { method, url, headers, body } = request;

    const enabledHeaders = headers.filter(h => h.enabled && h.key.trim());

    let code = `// XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.open('${method.toUpperCase()}', '${url}');
`;

    enabledHeaders.forEach(header => {
      code += `xhr.setRequestHeader('${header.key}', '${header.value}');\n`;
    });

    code += `
xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    if (xhr.status === 200) {
      console.log('Success:', xhr.responseText);
    } else {
      console.error('Error:', xhr.status, xhr.statusText);
    }
  }
};

xhr.send(${body.trim() ? `'${body.replace(/'/g, "\\'")}')` : 'null'});`;

    return code;
  }
}
