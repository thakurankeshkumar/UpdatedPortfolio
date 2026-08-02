import { NextRequest, NextResponse } from 'next/server';
import { getCloudinaryConfigError, uploadImage } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const { base64, folder } = await req.json();
    if (!base64) return NextResponse.json({ error: 'No image data provided' }, { status: 400 });

    const configError = getCloudinaryConfigError();
    if (configError) {
      return NextResponse.json({ error: configError }, { status: 400 });
    }

    const result = await uploadImage(base64, folder);
    return NextResponse.json(result);
  } catch (err: any) {
    const message = err.message || 'Upload failed';
    const isSignatureError = message.toLowerCase().includes('invalid signature');

    return NextResponse.json(
      {
        error: isSignatureError
          ? 'Cloudinary rejected the upload signature. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.'
          : message,
      },
      { status: isSignatureError ? 502 : 500 }
    );
  }
}
