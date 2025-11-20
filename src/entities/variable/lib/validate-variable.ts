import { Variable, VariableValidationResult } from '../model/variable.types';

export function validateVariable(
  variable: Partial<Variable>,
  existingVariables: Variable[] = [],
  excludeId?: string,
): VariableValidationResult {
  const errors: VariableValidationResult['errors'] = {};

  if (!variable.name?.trim()) {
    errors.name = 'Имя переменной обязательно';
  } else {
    const nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    if (!nameRegex.test(variable.name)) {
      errors.name = 'Имя может содержать только буквы, цифры и подчеркивания';
    } else if (variable.name.length > 50) {
      errors.name = 'Имя не должно превышать 50 символов';
    } else {
      const duplicate = existingVariables.find(v => v.name === variable.name && v.id !== excludeId);
      if (duplicate) {
        errors.name = 'Переменная с таким именем уже существует';
      }
    }
  }

  if (variable.value === undefined || variable.value === null) {
    errors.value = 'Значение переменной обязательно';
  } else if (variable.value.length > 1000) {
    errors.value = 'Значение не должно превышать 1000 символов';
  }

  if (variable.description && variable.description.length > 200) {
    errors.description = 'Описание не должно превышать 200 символов';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateVariableName(name: string): boolean {
  const nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return nameRegex.test(name) && name.length <= 50;
}
