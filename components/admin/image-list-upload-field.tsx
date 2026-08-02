'use client';
import Image from 'next/image';
import { ImagePlus, Trash2 } from 'lucide-react';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { Input } from '@/components/ui/input';

export function ImageListUploadField({
  value,
  onChange,
  folder = 'ankesh-brand',
}: {
  value: string[];
  onChange: (value: string[]) => void;
  folder?: string;
}) {
  const items = value || [];

  function updateAt(index: number, url: string) {
    onChange(items.map((item, i) => (i === index ? url : item)).filter(Boolean));
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((url, index) => (
          <div key={`${url}-${index}`} className="rounded-2xl border border-border bg-white p-3">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
              {url ? <Image src={url} alt={`Gallery image ${index + 1}`} fill sizes="320px" className="object-cover" /> : null}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded-lg px-2 py-1 text-xs font-semibold text-ink/35 hover:bg-muted hover:text-primary disabled:opacity-30">
                Up
              </button>
              <Input value={url} onChange={(e) => updateAt(index, e.target.value)} placeholder="https://..." className="h-9" />
              <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="rounded-lg px-2 py-1 text-xs font-semibold text-ink/35 hover:bg-muted hover:text-primary disabled:opacity-30">
                Down
              </button>
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="rounded-lg p-2 text-ink/35 hover:bg-red-50 hover:text-red-500" aria-label="Remove image">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-white/60 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-ink/50">
          <ImagePlus size={14} /> Add gallery image
        </div>
        <ImageUploadField value="" folder={folder} onChange={(url) => onChange([...items, url])} />
      </div>
    </div>
  );
}
