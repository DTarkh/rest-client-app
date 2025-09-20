import { useMemo } from 'react';
import { substituteVariables, validateVariablesInText } from '../lib/substitute-variables';
import type { HttpRequest } from './variables-request.types';
import { useVariableStore } from './variable.store';

export const useVariableSubstitution = (request: HttpRequest) => {
  const { variables } = useVariableStore();

  const processedRequest = useMemo(() => {
    if (!request || variables.length === 0) return request;

    const urlResult = substituteVariables(request.url, variables);

    const processedHeaders = request.headers.map(header => ({
      ...header,
      key: substituteVariables(header.key, variables).text,
      value: substituteVariables(header.value, variables).text,
    }));

    const bodyResult = substituteVariables(request.body, variables);

    return {
      ...request,
      url: urlResult.text,
      headers: processedHeaders,
      body: bodyResult.text,
    };
  }, [request, variables]);

  const validation = useMemo(() => {
    if (!request) return { isValid: true, issues: [] };

    const issues: { field: string; missingVariables: string[] }[] = [];

    const urlValidation = validateVariablesInText(request.url, variables);
    if (!urlValidation.isValid) {
      issues.push({
        field: 'URL',
        missingVariables: urlValidation.missingVariables,
      });
    }

    request.headers.forEach((header, index) => {
      const keyValidation = validateVariablesInText(header.key, variables);
      const valueValidation = validateVariablesInText(header.value, variables);

      if (!keyValidation.isValid || !valueValidation.isValid) {
        issues.push({
          field: `Header ${index + 1}`,
          missingVariables: [
            ...keyValidation.missingVariables,
            ...valueValidation.missingVariables,
          ],
        });
      }
    });

    const bodyValidation = validateVariablesInText(request.body, variables);
    if (!bodyValidation.isValid) {
      issues.push({
        field: 'Body',
        missingVariables: bodyValidation.missingVariables,
      });
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }, [request, variables]);

  return {
    processedRequest,
    validation,
    hasVariables: variables.length > 0,
  };
};
