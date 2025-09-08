import { HttpRequest } from '../model/request.types';

export function validateRequest(request: HttpRequest) {
  const errors: Record<string, string> = {};

  if (!request.url.trim()) {
    errors.url = 'URL обязателен';
  } else {
    try {
      const url = new URL(request.url);
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.url = 'URL должен начинаться с http:// или https://';
      }
    } catch {
      errors.url = 'Некорректный формат URL';
    }
  }

  const enabledHeaders = request.headers.filter(h => h.enabled);
  for (const header of enabledHeaders) {
    if (header.key.trim() && !header.value.trim()) {
      errors[`header-${header.id}`] = 'Значение заголовка не может быть пустым';
    }
    if (!header.key.trim() && header.value.trim()) {
      errors[`header-${header.id}`] = 'Название заголовка не может быть пустым';
    }
  }

  if (request.bodyType === 'json' && request.body.trim()) {
    try {
      JSON.parse(request.body);
    } catch {
      errors.body = 'Некорректный JSON формат';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    validationErrors: errors,
  };
}
