import { substituteVariables } from './substitute-variables';

export type SubstitutionPreview = {
  originalText: string;
  substitutedText: string;
  foundVariables: {
    name: string;
    value: string;
    position: { start: number; end: number };
  }[];
  missingVariables: string[];
};

export type Variable = {
  id: string;
  name: string;
  value: string;
  description?: string;
  isSecret?: boolean;
  createdAt: number;
  updatedAt: number;
};

export function createSubstitutionPreview(
  text: string,
  variables: Variable[],
): SubstitutionPreview {
  const result = substituteVariables(text, variables);

  const variablePositions: SubstitutionPreview['foundVariables'] = [];
  const variableMap = new Map(variables.map(v => [v.name, v.value]));

  let match;
  const regex = /\{\{(\w+)\}\}/g;

  while ((match = regex.exec(text)) !== null) {
    const variableName = match[1];
    const value = variableMap.get(variableName) || `{{${variableName}}}`;

    variablePositions.push({
      name: variableName,
      value,
      position: {
        start: match.index,
        end: match.index + match[0].length,
      },
    });
  }

  return {
    originalText: text,
    substitutedText: result.text,
    foundVariables: variablePositions,
    missingVariables: result.missingVariables,
  };
}

export function highlightVariables(text: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, match => {
    return `<mark class="variable-highlight">${match}</mark>`;
  });
}
