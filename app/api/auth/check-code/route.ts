import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { MAINTENANCE_ACCESS_COOKIE, signMaintenanceAccess } from '@/lib/auth';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getClientKey(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

function isLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }
  return current.count >= MAX_ATTEMPTS;
}

function recordAttempt(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  attempts.set(key, { ...current, count: current.count + 1 });
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export async function POST(req: NextRequest) {
  try {
    const key = getClientKey(req);
    if (isLimited(key)) {
      return NextResponse.json({ match: false }, { status: 429 });
    }
    recordAttempt(key);

    const { code } = await req.json();
    await connectDB();
    const settings = await SiteSettings.findOne();
    const match = !!code && !!settings?.secretAdminCode && safeEqual(String(code), String(settings.secretAdminCode));
    const response = NextResponse.json({ match });
    if (match) {
      response.cookies.set(MAINTENANCE_ACCESS_COOKIE, signMaintenanceAccess(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 10,
      });
    }
    return response;
  } catch {
    return NextResponse.json({ match: false });
  }
}
