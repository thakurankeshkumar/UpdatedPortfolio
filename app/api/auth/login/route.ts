import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifyPassword, signSession, setSessionCookie } from '@/lib/auth';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getClientKey(req: NextRequest, email: string) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || req.headers.get('x-real-ip') || 'unknown';
  return `${ip}:${email.toLowerCase()}`;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return null;
  }
  if (current.count >= MAX_ATTEMPTS) {
    return Math.ceil((current.resetAt - now) / 1000);
  }
  return null;
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  attempts.set(key, { ...current, count: current.count + 1 });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');

    if (!normalizedEmail || !normalizedPassword) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const key = getClientKey(req, normalizedEmail);
    const retryAfter = checkRateLimit(key);
    if (retryAfter) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    await connectDB();
    const admin: any = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      recordFailedAttempt(key);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(normalizedPassword, admin.passwordHash);
    if (!valid) {
      recordFailedAttempt(key);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signSession({ id: admin._id.toString(), email: admin.email, name: admin.name });
    setSessionCookie(token);
    attempts.delete(key);

    return NextResponse.json({ ok: true, email: admin.email, name: admin.name });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
