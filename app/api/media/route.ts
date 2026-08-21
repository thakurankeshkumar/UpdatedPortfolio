import { NextRequest, NextResponse } from 'next/server';
import { deleteImage, getCloudinaryConfigError, listImages } from '@/lib/cloudinary';
import { noStoreJson } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FOLDER_PATTERN = /^[a-z0-9/_-]{1,80}$/i;

export async function GET(req: NextRequest) {
  try {
    const configError = getCloudinaryConfigError();
    if (configError) return NextResponse.json({ error: configError }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const requestedFolder = searchParams.get('folder') || 'ankesh-brand';
    const folder = FOLDER_PATTERN.test(requestedFolder) ? requestedFolder : 'ankesh-brand';
    const cursor = searchParams.get('cursor') || undefined;
    const data = await listImages(folder, cursor);
    return noStoreJson(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to load media library' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { publicId, url } = await req.json();
    const target = publicId || url;
    if (!target) return NextResponse.json({ error: 'publicId or url is required' }, { status: 400 });

    const result = await deleteImage(target);
    return noStoreJson({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete media asset' }, { status: 400 });
  }
}
