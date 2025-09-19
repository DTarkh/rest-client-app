const VARIABLE_REGEX = /\{\{(\w+)\}\}/g;

export type Variable = {
  id: string;
  name: string;
  value: string;
  description?: string;
  isSecret?: boolean; // Для скрытия значений токенов
  createdAt: number;
  updatedAt: number;
};

export type SubstitutionResult = {
  text: string;
  substitutions: {
    variable: string;
    value: string;
    count: number;
  }[];
  missingVariables: string[];
};

export function substituteVariables(text: string, variables: Variable[]): SubstitutionResult {
  const variableMap = new Map(variables.map(v => [v.name, v.value]));
  const substitutions: SubstitutionResult['substitutions'] = [];
  const missingVariables = new Set<string>();

  const substitutedText = text.replace(VARIABLE_REGEX, (match, variableName) => {
    if (variableMap.has(variableName)) {
      const value = variableMap.get(variableName)!;

      // Учитываем количество замен
      const existing = substitutions.find(s => s.variable === variableName);
      if (existing) {
        existing.count++;
      } else {
        substitutions.push({
          variable: variableName,
          value,
          count: 1,
        });
      }

      return value;
    } else {
      missingVariables.add(variableName);
      return match; // Оставляем неизмененным если переменная не найдена
    }
  });

  return {
    text: substitutedText,
    substitutions,
    missingVariables: Array.from(missingVariables),
  };
}

export function findVariablesInText(text: string): string[] {
  const matches = Array.from(text.matchAll(VARIABLE_REGEX));
  return [...new Set(matches.map(match => match[1]))];
}

export function hasVariables(text: string): boolean {
  return VARIABLE_REGEX.test(text);
}

export function validateVariablesInText(
  text: string,
  variables: Variable[],
): {
  isValid: boolean;
  missingVariables: string[];
} {
  const foundVariables = findVariablesInText(text);
  const variableNames = new Set(variables.map(v => v.name));
  const missingVariables = foundVariables.filter(name => !variableNames.has(name));

  return {
    isValid: missingVariables.length === 0,
    missingVariables,
  };
}
