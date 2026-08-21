import { NextRequest, NextResponse } from 'next/server';
import { getCloudinaryConfigError, uploadImage } from '@/lib/cloudinary';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DATA_URL_PATTERN = /^data:image\/(png|jpe?g|webp|gif|avif);base64,/i;
const FOLDER_PATTERN = /^[a-z0-9/_-]{1,80}$/i;

export async function POST(req: NextRequest) {
  try {
    const { base64, folder } = await req.json();
    if (!base64) return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    if (typeof base64 !== 'string' || !DATA_URL_PATTERN.test(base64)) {
      return NextResponse.json({ error: 'Only PNG, JPG, WebP, GIF, and AVIF images are allowed.' }, { status: 400 });
    }

    const encoded = base64.split(',')[1] || '';
    const estimatedBytes = Math.ceil((encoded.length * 3) / 4);
    if (estimatedBytes > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Image is too large. Please upload an image under 5MB.' }, { status: 413 });
    }

    const configError = getCloudinaryConfigError();
    if (configError) {
      return NextResponse.json({ error: configError }, { status: 400 });
    }

    const targetFolder = typeof folder === 'string' && FOLDER_PATTERN.test(folder) ? folder : 'ankesh-brand';
    const result = await uploadImage(base64, targetFolder);
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
