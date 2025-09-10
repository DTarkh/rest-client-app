import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './src/shared/config/supabase';
import { isProtectedRoute, isAuthRoute } from './src/shared/config/routes';

async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  try {
    const {
      data: { user },
    } = await supabase.getUser();
    const isAuthenticated = !!user;

    if (isAuthenticated && isAuthRoute(pathname)) {
      const redirectUrl = new URL('/client', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (!isAuthenticated && isProtectedRoute(pathname)) {
      const redirectUrl = new URL('/signin', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export default authMiddleware;

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
