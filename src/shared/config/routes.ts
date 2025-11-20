export const PUBLIC_ROUTES = ['/', '/signin', '/signup'] as const;

export const PROTECTED_ROUTES = ['/client', '/variables', '/history'] as const;

export const AUTH_ROUTES = ['/signin', '/signup'] as const;

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(route);
  });
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route));
}
