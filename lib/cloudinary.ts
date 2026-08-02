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

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
