'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Check, Copy, ImageIcon, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MediaAsset {
  publicId: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function MediaLibrary({
  onSelect,
  selectedUrl,
  compact = false,
}: {
  onSelect?: (url: string) => void;
  selectedUrl?: string;
  compact?: boolean;
}) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [cursor, setCursor] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleting, setDeleting] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async (nextCursor = '') => {
    nextCursor ? setLoadingMore(true) : setLoading(true);
    setError('');
    try {
      const query = nextCursor ? `?cursor=${encodeURIComponent(nextCursor)}` : '';
      const res = await fetch(`/api/media${query}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load media');
      setAssets((prev) => (nextCursor ? [...prev, ...data.resources] : data.resources));
      setCursor(data.nextCursor || '');
    } catch (err: any) {
      setError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function deleteAsset(asset: MediaAsset) {
    if (!window.confirm('Delete this image from Cloudinary permanently? Reused references may stop displaying.')) return;
    setDeleting(asset.publicId);
    setError('');
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: asset.publicId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete image');
      setAssets((prev) => prev.filter((item) => item.publicId !== asset.publicId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    } finally {
      setDeleting('');
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard?.writeText(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-base font-semibold text-ink">Media Library</h2>
          <p className="mt-1 text-xs text-ink/50">Reuse uploaded Cloudinary images to save storage and keep pages fast.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => load()} disabled={loading}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refresh
        </Button>
      </div>

      {error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-ink/40">Loading media...</p>}

      {!loading && !assets.length && (
        <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
          <ImageIcon className="mx-auto text-ink/20" size={28} />
          <p className="mt-3 text-sm font-medium text-ink">No images uploaded yet</p>
          <p className="mt-1 text-xs text-ink/45">Upload a cover, avatar, thumbnail, or gallery image and it will appear here.</p>
        </div>
      )}

      <div className={cn('grid gap-3', compact ? 'grid-cols-2 sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4')}>
        {assets.map((asset) => (
          <div key={asset.publicId} className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <button
              type="button"
              onClick={() => onSelect?.(asset.url)}
              className={cn('relative block aspect-video w-full overflow-hidden bg-muted', onSelect && 'hover:opacity-90')}
              aria-label={`Select ${asset.publicId}`}
            >
              <Image src={asset.url} alt={asset.publicId} fill sizes={compact ? '180px' : '320px'} className="object-cover" />
              {selectedUrl === asset.url && (
                <span className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={15} />
                </span>
              )}
            </button>
            <div className="space-y-3 p-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-ink" title={asset.publicId}>{asset.publicId}</p>
                <p className="mt-1 text-[11px] text-ink/40">
                  {asset.width}x{asset.height} · {formatBytes(asset.bytes)} · {asset.format?.toUpperCase()}
                </p>
              </div>
              <div className="flex gap-2">
                {onSelect && (
                  <Button type="button" variant="primary" size="sm" className="h-8 flex-1 px-3 text-xs" onClick={() => onSelect(asset.url)}>
                    <Check size={13} /> Use
                  </Button>
                )}
                <Button type="button" variant="outline" size="sm" className="h-8 px-3" onClick={() => copyUrl(asset.url)} aria-label="Copy image URL">
                  <Copy size={13} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-red-500 hover:bg-red-50"
                  onClick={() => deleteAsset(asset)}
                  disabled={deleting === asset.publicId}
                  aria-label="Delete image"
                >
                  {deleting === asset.publicId ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cursor && (
        <Button type="button" variant="outline" onClick={() => load(cursor)} disabled={loadingMore} className="w-full">
          {loadingMore ? <Loader2 size={15} className="animate-spin" /> : null} Load more
        </Button>
      )}
    </div>
  );
}
