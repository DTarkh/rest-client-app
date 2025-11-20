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
