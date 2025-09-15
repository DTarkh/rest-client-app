import type { HttpMethod } from '@/src/entities/http-request';

export type HttpMethodConfig = {
  value: HttpMethod;
  label: string;
  color: string;
  bgColor: string;
};

export const HTTP_METHODS: HttpMethodConfig[] = [
  { value: 'GET', label: 'GET', color: 'text-green-600', bgColor: 'bg-green-50' },
  { value: 'POST', label: 'POST', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'PUT', label: 'PUT', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { value: 'DELETE', label: 'DELETE', color: 'text-red-600', bgColor: 'bg-red-50' },
  { value: 'PATCH', label: 'PATCH', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { value: 'HEAD', label: 'HEAD', color: 'text-gray-600', bgColor: 'bg-gray-50' },
  { value: 'OPTIONS', label: 'OPTIONS', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
];

export const getMethodConfig = (method: HttpMethod): HttpMethodConfig => {
  return HTTP_METHODS.find(m => m.value === method) || HTTP_METHODS[0];
};
