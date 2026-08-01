'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImageUploadField({
  value,
  onChange,
  folder = 'ankesh-brand',
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function handleFile(file: File) {
    setError('');
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: reader.result, folder }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        onChange(data.url);
      } catch (err: any) {
        setError(err.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      {value ? (
        <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 rounded-full bg-dark/70 p-1.5 text-white"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-ink/40 hover:border-primary hover:text-primary">
          <Upload size={20} />
          <span className="text-xs">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
