import { HttpRequest } from '../model/request.types';

export function encodeRequestToUrl(request: HttpRequest): string {
  const { method, url, headers, body } = request;

  const encodedUrl = btoa(encodeURIComponent(url));

  const encodedBody = body.trim() ? btoa(encodeURIComponent(body)) : '';

  const enabledHeaders = headers.filter(h => h.enabled && h.key.trim());
  const headerParams = new URLSearchParams();

  enabledHeaders.forEach(header => {
    headerParams.append(header.key, header.value);
  });

  const pathSegments = [method, encodedUrl];
  if (encodedBody) {
    pathSegments.push(encodedBody);
  }

  const queryString = headerParams.toString();
  const finalUrl = `/client/${pathSegments.join('/')}${queryString ? `?${queryString}` : ''}`;

  return finalUrl;
}
