import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const { base64, folder } = await req.json();
    if (!base64) return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json({ error: 'Cloudinary is not configured yet. Add your credentials to .env.local.' }, { status: 400 });
    }
    const result = await uploadImage(base64, folder);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
