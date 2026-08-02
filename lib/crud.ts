import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import type { Model } from 'mongoose';
import { noStoreJson } from '@/lib/api';

export function createCollectionHandlers(getModel: () => Model<any>, sort: Record<string, 1 | -1> = { order: 1 }) {
  async function GET() {
    try {
      await connectDB();
      const docs = await getModel().find().sort(sort).lean();
      return noStoreJson(docs);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  async function POST(req: NextRequest) {
    try {
      await connectDB();
      const body = await req.json();
      const doc = await getModel().create(body);
      return noStoreJson(doc, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }

  return { GET, POST };
}

export function createItemHandlers(getModel: () => Model<any>) {
  async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const body = await req.json();
      const updated = await getModel().findByIdAndUpdate(params.id, body, { new: true });
      return noStoreJson(updated);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }

  async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      await getModel().findByIdAndDelete(params.id);
      return noStoreJson({ ok: true });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }

  return { PUT, DELETE };
}
