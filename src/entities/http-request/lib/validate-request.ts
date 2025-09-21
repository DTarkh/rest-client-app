import { HttpRequest } from '../model/request.types';

export function validateRequest(request: HttpRequest) {
  const errors: Record<string, string> = {};

  if (!request.url.trim()) {
    errors.url = 'urlRequired';
  } else {
    try {
      const url = new URL(request.url);
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.url = 'urlProtocol';
      }
    } catch {
      errors.url = 'urlInvalid';
    }
  }

  const enabledHeaders = request.headers.filter(h => h.enabled);
  for (const header of enabledHeaders) {
    if (header.key.trim() && !header.value.trim()) {
      errors[`header-${header.id}`] = 'headerValueRequired';
    }
    if (!header.key.trim() && header.value.trim()) {
      errors[`header-${header.id}`] = 'headerKeyRequired';
    }
  }

  if (request.bodyType === 'json' && request.body.trim()) {
    try {
      JSON.parse(request.body);
    } catch {
      errors.body = 'invalidJson';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    validationErrors: errors,
  };
}
