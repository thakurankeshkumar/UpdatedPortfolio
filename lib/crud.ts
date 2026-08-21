import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import type { Model } from 'mongoose';
import { noStoreJson } from '@/lib/api';
import { deleteImage } from '@/lib/cloudinary';

interface ItemHandlerOptions {
  assetFields?: string[];
}

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

function collectAssetUrls(doc: any, fields: string[] = []) {
  return fields.flatMap((field) => {
    const value = doc?.[field];
    const values = Array.isArray(value) ? value : value ? [value] : [];
    return values.filter((item) => typeof item === 'string' && item.includes('res.cloudinary.com'));
  });
}

export function createItemHandlers(getModel: () => Model<any>, options: ItemHandlerOptions = {}) {
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
      const deleted = await getModel().findByIdAndDelete(params.id).lean();
      const assetUrls = Array.from(new Set(collectAssetUrls(deleted, options.assetFields)));
      if (assetUrls.length) {
        await Promise.allSettled(assetUrls.map((url) => deleteImage(url)));
      }
      return noStoreJson({ ok: true });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }

  return { PUT, DELETE };
}
