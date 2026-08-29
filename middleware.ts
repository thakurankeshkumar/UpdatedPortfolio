import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = 'admin_session';
const MAINTENANCE_ACCESS_COOKIE = 'maintenance_admin_access';
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

async function hasMaintenanceLoginAccess(token?: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.purpose === 'maintenance-login';
  } catch {
    return false;
  }
}

async function isMaintenanceMode(req: NextRequest) {
  try {
    const response = await fetch(new URL('/api/maintenance-status', req.url), {
      cache: 'no-store',
      headers: { 'x-maintenance-status-check': '1' },
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.maintenanceMode === true;
  } catch {
    // Do not take the site offline solely because the settings database is unavailable.
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const maintenanceAccessToken = req.cookies.get(MAINTENANCE_ACCESS_COOKIE)?.value;
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // The status endpoint is intentionally public so middleware can read the current
  // database-backed switch for every request without a deploy or stale cache.
  if (pathname !== '/api/maintenance-status' && await isMaintenanceMode(req)) {
    const isAdmin = await isValid(token);
    const hasLoginAccess = isAdmin || await hasMaintenanceLoginAccess(maintenanceAccessToken);
    const publicMaintenanceRoutes = [
      '/contact',
      '/api/contact',
      '/api/auth/check-code',
      '/api/maintenance-status',
    ];
    const isPublicMaintenanceRoute = publicMaintenanceRoutes.includes(pathname);
    const isLoginRoute = pathname === '/admin/login' || pathname === '/api/auth/login';
    const isAllowedAdminRoute = isAdmin && (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/api/'));

    if (!isPublicMaintenanceRoute && !(isLoginRoute && hasLoginAccess) && !isAllowedAdminRoute) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'The site is currently undergoing maintenance.' },
          { status: 503, headers: { 'Retry-After': '300' } }
        );
      }
      return NextResponse.redirect(new URL('/contact', req.url));
    }
  }

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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
