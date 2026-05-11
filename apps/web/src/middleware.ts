import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require admin authentication
const ADMIN_ROUTES = ['/dashboard'];

// Routes that are publicly accessible (but may have token-gated content)
const PUBLIC_ROUTES = ['/', '/our-story', '/events', '/gallery', '/videos', '/blessings'];

// Routes that are always public
const ALWAYS_PUBLIC = ['/', '/api/health'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Generate or retrieve session ID for analytics
  let sessionId = request.cookies.get('wedding_session')?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }

  // Add session ID to response headers for client-side access
  const response = NextResponse.next();
  response.cookies.set('wedding_session', sessionId, {
    httpOnly: false, // Needs to be accessible by client JS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Admin route protection
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    // Check for admin session token
    const adminToken = request.cookies.get('admin_session')?.value;

    if (!adminToken) {
      // Redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // TODO: Validate admin token with Supabase
    // For now, just check if token exists
  }

  // Guest access token verification for protected content
  const token = request.nextUrl.searchParams.get('token');
  if (token) {
    // Store token in cookie for the session
    response.cookies.set('guest_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Remove token from URL
    const url = request.nextUrl.clone();
    url.searchParams.delete('token');
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     * - api routes (except those that need auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
