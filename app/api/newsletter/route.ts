import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const schema = z.object({ email: z.string().email().max(254) });

export async function POST(req: NextRequest) {
  try {
    const retryAfter = checkRateLimit(`newsletter:${getClientIp(req)}`, 12, 15 * 60 * 1000);
    if (retryAfter) {
      return NextResponse.json(
        { error: 'Too many signups. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }
    const email = parsed.data.email.trim().toLowerCase();
    await connectDB();
    await Newsletter.findOneAndUpdate({ email }, { email }, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
