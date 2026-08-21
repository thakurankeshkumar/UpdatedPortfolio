import { NextRequest } from 'next/server';

const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= maxAttempts) {
    return Math.ceil((current.resetAt - now) / 1000);
  }

  buckets.set(key, { ...current, count: current.count + 1 });
  return null;
}
