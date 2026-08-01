import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
import { sendContactNotification } from '@/lib/mail';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  budget: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please fill in all required fields correctly.' }, { status: 400 });
    }

    await connectDB();
    await Message.create(parsed.data);

    try {
      await sendContactNotification(parsed.data);
    } catch {
      // Email is best-effort; the message is already saved in the DB either way.
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 });
  }
}
