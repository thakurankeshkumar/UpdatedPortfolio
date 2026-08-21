import { v2 as cloudinary } from 'cloudinary';

function cleanEnvValue(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return '';

  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

const cloudinaryConfig = {
  cloud_name: cleanEnvValue(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: cleanEnvValue(process.env.CLOUDINARY_API_KEY),
  api_secret: cleanEnvValue(process.env.CLOUDINARY_API_SECRET),
};

cloudinary.config(cloudinaryConfig);

export function getCloudinaryConfigError() {
  const missing = Object.entries(cloudinaryConfig)
    .filter(([, value]) => !value)
    .map(([key]) => `CLOUDINARY_${key.toUpperCase()}`);

  if (missing.length > 0) {
    return `Cloudinary is not configured yet. Missing: ${missing.join(', ')}.`;
  }

  if (cloudinaryConfig.api_secret.length < 20) {
    return 'CLOUDINARY_API_SECRET looks invalid. Copy the API Secret from your Cloudinary dashboard, not the API Key.';
  }

  return null;
}

export async function uploadImage(base64: string, folder = 'ankesh-brand') {
  const configError = getCloudinaryConfigError();
  if (configError) throw new Error(configError);

  const result = await cloudinary.uploader.upload(base64, { folder });
  return { url: result.secure_url, publicId: result.public_id };
}

export function getPublicIdFromUrl(value?: string) {
  if (!value) return '';
  if (!value.includes('res.cloudinary.com')) return value;

  try {
    const url = new URL(value);
    const uploadIndex = url.pathname.indexOf('/upload/');
    if (uploadIndex === -1) return '';

    const afterUpload = url.pathname.slice(uploadIndex + '/upload/'.length);
    const parts = afterUpload.split('/').filter(Boolean);
    const versionIndex = parts.findIndex((part) => /^v\d+$/.test(part));
    const publicPath = (versionIndex >= 0 ? parts.slice(versionIndex + 1) : parts).join('/');
    return decodeURIComponent(publicPath).replace(/\.[a-z0-9]+$/i, '');
  } catch {
    return '';
  }
}

export async function deleteImage(publicIdOrUrl: string) {
  const configError = getCloudinaryConfigError();
  if (configError) throw new Error(configError);

  const publicId = getPublicIdFromUrl(publicIdOrUrl);
  if (!publicId) throw new Error('Could not identify this Cloudinary asset.');

  return cloudinary.uploader.destroy(publicId, { invalidate: true });
}

export async function listImages(folder = 'ankesh-brand', nextCursor?: string) {
  const configError = getCloudinaryConfigError();
  if (configError) throw new Error(configError);

  const result = await cloudinary.api.resources({
    type: 'upload',
    resource_type: 'image',
    prefix: folder,
    max_results: 60,
    next_cursor: nextCursor,
  });

  return {
    resources: result.resources.map((asset: any) => ({
      publicId: asset.public_id,
      url: asset.secure_url,
      width: asset.width,
      height: asset.height,
      bytes: asset.bytes,
      format: asset.format,
      createdAt: asset.created_at,
    })),
    nextCursor: result.next_cursor || '',
  };
}

export default cloudinary;
