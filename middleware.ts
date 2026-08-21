import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = 'admin_session';
const MUTATION_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

async function isValid(token?: string) {
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (pathname.startsWith('/admin/dashboard')) {
    if (!(await isValid(token))) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  const protectedApi = ['/api/projects', '/api/blogs', '/api/services', '/api/testimonials', '/api/messages', '/api/upload', '/api/media', '/api/settings'];
  const isProtectedApi = protectedApi.some((p) => pathname.startsWith(p));
  const isMutation = MUTATION_METHODS.includes(req.method);
  const isMessagesRead = pathname.startsWith('/api/messages') && req.method === 'GET';
  const isSettingsRead = pathname.startsWith('/api/settings') && req.method === 'GET';
  const isMediaRead = pathname.startsWith('/api/media') && req.method === 'GET';

  if ((isProtectedApi && isMutation) || isMessagesRead || isSettingsRead || isMediaRead) {
    if (!(await isValid(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isMutation) {
      const origin = req.headers.get('origin');
      if (origin && origin !== req.nextUrl.origin) {
        return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/api/projects/:path*',
    '/api/blogs/:path*',
    '/api/services/:path*',
    '/api/testimonials/:path*',
    '/api/messages/:path*',
    '/api/upload/:path*',
    '/api/media/:path*',
    '/api/settings/:path*',
  ],
};
