'use client';
import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-ui';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { MediaLibrary } from '@/components/admin/media-library';

export default function MediaAdminPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <AdminHeader
        title="Media Library"
        description="Browse previously uploaded Cloudinary images, reuse assets in content fields, and permanently delete unused files."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="self-start rounded-3xl border border-border bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UploadCloud size={18} />
            </span>
            <div>
              <h2 className="font-heading text-base font-semibold text-ink">Upload Image</h2>
              <p className="text-xs text-ink/45">Use compressed images under 5MB for best performance.</p>
            </div>
          </div>
          <ImageUploadField value="" onChange={() => setRefreshKey((key) => key + 1)} />
        </section>

        <section className="rounded-3xl border border-border bg-white p-5 shadow-soft">
          <MediaLibrary key={refreshKey} />
        </section>
      </div>
    </div>
  );
}
