import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { noStoreJson } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    let doc = await SiteSettings.findOne();
    if (!doc) doc = await SiteSettings.create({});
    return noStoreJson(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    let doc = await SiteSettings.findOne();
    if (!doc) doc = new SiteSettings({});
    Object.assign(doc, body);
    await doc.save();
    return noStoreJson(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
