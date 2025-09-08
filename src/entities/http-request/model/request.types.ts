export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type HeaderEntry = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

export type HttpRequest = {
  id?: string;
  method: HttpMethod;
  url: string;
  headers: HeaderEntry[];
  body: string;
  bodyType: 'json' | 'text' | 'none';
  timestamp?: number;
};

export type RequestState = {
  currentRequest: HttpRequest;
  isValid: boolean;
  validationErrors: Record<string, string>;

  // Actions
  setMethod: (method: HttpMethod) => void;
  setUrl: (url: string) => void;
  setHeaders: (headers: HeaderEntry[]) => void;
  setBody: (body: string, type?: 'json' | 'text') => void;
  addHeader: () => void;
  removeHeader: (id: string) => void;
  toggleHeader: (id: string) => void;
  resetRequest: () => void;
  validateRequest: () => boolean;
};
