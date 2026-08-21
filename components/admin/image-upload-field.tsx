'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaLibrary } from '@/components/admin/media-library';

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
  const [deleting, setDeleting] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [error, setError] = useState('');

  function handleFile(file: File) {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large. Please choose a file under 5MB.');
      return;
    }
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

  async function deleteCurrentImage() {
    if (!value) return;
    if (!value.includes('res.cloudinary.com')) {
      onChange('');
      return;
    }
    if (!window.confirm('Delete this image from Cloudinary and clear this field?')) return;

    setDeleting(true);
    setError('');
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete image');
      onChange('');
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <button
            type="button"
            onClick={deleteCurrentImage}
            disabled={deleting}
            className="absolute right-2 top-2 rounded-full bg-dark/70 p-1.5 text-white"
            aria-label="Delete image from Cloudinary"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
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
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setLibraryOpen((open) => !open)}>
          <ImageIcon size={14} /> {libraryOpen ? 'Hide Library' : 'Choose Existing'}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>
            Clear field only
          </Button>
        )}
      </div>
      {libraryOpen && (
        <div className="mt-3 rounded-2xl border border-border bg-muted/30 p-3">
          <MediaLibrary
            compact
            selectedUrl={value}
            onSelect={(url) => {
              onChange(url);
              setLibraryOpen(false);
            }}
          />
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
