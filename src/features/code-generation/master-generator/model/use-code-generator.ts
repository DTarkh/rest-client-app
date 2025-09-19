import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HttpRequest } from '@/src/entities/http-request';
import {
  SupportedLanguage,
  useCodeSnippetStore,
  getLanguageConfig,
} from '@/src/entities/code-snippet';
import { useVariableStore } from '@/src/entities/variable';
import { CodeGenerator } from '../api/code-generator';
import { substituteVariables } from '@/src/entities/variable-substitution';

type GenerateCodeParams = {
  request: HttpRequest;
  language: SupportedLanguage;
};

async function generateCode({ request, language }: GenerateCodeParams) {
  const config = getLanguageConfig(language);

  //   Важно: заменяем переменные перед генерацией кода
  const variables = useVariableStore.getState().variables;
  // Предполагаем, что нужно заменить переменные в теле запроса (body) или url, например:
  const substituted = substituteVariables(request.body ?? '', variables);
  // Создаем новый объект запроса с подставленными переменными
  const processedRequest = {
    ...request,
    body: substituted.text,
  };

  const raw = CodeGenerator.generate(processedRequest, language);
  const code = (typeof raw === 'string' ? raw : '') ?? '';

  return {
    id: crypto.randomUUID(),
    language,
    code,
    label: config.label,
    prismLanguage: config.prismLanguage,
    generatedAt: Date.now(),
    isValid: Boolean(code) && !code.startsWith('# Ошибка') && !code.startsWith('// Ошибка'),
    error: !code
      ? 'Пустой результат генерации'
      : code.startsWith('# Ошибка') || code.startsWith('// Ошибка')
        ? 'Ошибка генерации кода'
        : undefined,
  };
}

export const useCodeGenerator = () => {
  const { setSnippet, setGenerating, setError } = useCodeSnippetStore();

  return useMutation({
    mutationFn: generateCode,
    onMutate: () => {
      setGenerating(true);
    },
    onSuccess: (snippet, variables) => {
      setSnippet(variables.language, snippet);

      if (!snippet.isValid) {
        toast.error(`Не удалось сгенерировать код для ${snippet.label}`);
      }
    },
    onError: (error: Error, variables) => {
      const config = getLanguageConfig(variables.language);
      setError(`Ошибка генерации ${config.label}: ${error.message}`);
      toast.error(`Ошибка генерации ${config.label}`);
    },
    onSettled: () => {
      setGenerating(false);
    },
  });
};
