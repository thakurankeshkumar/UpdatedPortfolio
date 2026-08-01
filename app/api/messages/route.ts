import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';

export async function GET() {
  try {
    await connectDB();
    const docs = await Message.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(docs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
