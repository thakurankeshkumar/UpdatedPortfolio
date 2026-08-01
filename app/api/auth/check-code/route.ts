import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    await connectDB();
    const settings = await SiteSettings.findOne();
    const match = !!code && !!settings?.secretAdminCode && code === settings.secretAdminCode;
    return NextResponse.json({ match });
  } catch {
    return NextResponse.json({ match: false });
  }
}
