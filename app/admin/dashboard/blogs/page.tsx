'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Plus, Pencil, Trash2, X } from 'lucide-react';
import { BlogPost } from '@/types';
import { useCrud } from '@/hooks/use-crud';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { AdminHeader, AdminSearch, EmptyState, StatusPill } from '@/components/admin/admin-ui';

const empty: any = {
  title: '', slug: '', excerpt: '', content: '', coverImage: '', category: 'General', tagsInput: '', readingTime: '3 min read', published: true,
};

function estimateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function BlogsAdminPage() {
  const { items, loading, error, create, update, remove } = useCrud<BlogPost>('/api/blogs');
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  function startCreate() { setForm(empty); setEditingId(null); setOpen(true); }
  function startEdit(b: BlogPost) {
    setForm({ ...b, tagsInput: b.tags.join(', ') });
    setEditingId(b._id);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        tags: (form.tagsInput || '').split(',').map((t: string) => t.trim()).filter(Boolean),
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        readingTime: estimateReadingTime(form.content || ''),
      };
      delete payload.tagsInput;
      if (editingId) await update(editingId, payload);
      else await create(payload);
      setOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  }

  const filtered = items.filter((b) => {
    const text = `${b.title} ${b.excerpt} ${b.category} ${b.tags.join(' ')}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div>
      <AdminHeader
        title="Blog Posts"
        description="Create drafts, publish articles, manage tags, and attach cover images that render on the live blog."
        count={`${items.length} post${items.length === 1 ? '' : 's'}`}
        action={<Button variant="primary" onClick={startCreate} className="w-full sm:w-auto"><Plus size={16} /> Add Post</Button>}
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearch value={query} onChange={setQuery} placeholder="Search posts..." />
        <Link href="/blog" target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          Public blog <ExternalLink size={14} />
        </Link>
      </div>

      {error && <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">{error}</p>}

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">{editingId ? 'Edit Post' : 'New Post'}</h2>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-ink/40 hover:bg-muted hover:text-ink"><X size={18} /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Slug (auto if blank)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          </div>
          <div className="mt-4"><Label>Excerpt</Label><Input required value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div className="mt-4"><Label>Content (markdown supported)</Label><Textarea required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div><Label>Tags (comma separated)</Label><Input value={form.tagsInput} onChange={(e) => setForm({ ...form, tagsInput: e.target.value })} /></div>
          </div>
          <div className="mt-4"><Label>Cover image</Label><ImageUploadField value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} /></div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
          </label>
          {formError && <p className="mt-4 text-sm text-red-500">{formError}</p>}
          <Button type="submit" variant="primary" disabled={saving} className="mt-6 w-full sm:w-auto">{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Post'}</Button>
        </form>
      )}

      <div className="mt-8 grid gap-4">
        {loading && <p className="text-sm text-ink/40">Loading...</p>}
        {!loading && !filtered.length && <EmptyState title="No posts found" description="Create a post or clear your search to see every article." href="/blog" />}
        {filtered.map((b) => (
          <div key={b._id} className="grid gap-4 rounded-3xl border border-border bg-white p-4 shadow-soft md:grid-cols-[180px_1fr_auto] md:items-center">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted md:aspect-[4/3]">
              {b.coverImage ? (
                <Image src={b.coverImage} alt={b.title} fill sizes="180px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center font-heading text-3xl font-bold text-ink/10">{b.category?.slice(0, 2).toUpperCase()}</div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-heading font-semibold text-ink">{b.title}</h3>
              <p className="mt-1 text-sm text-ink/50">{b.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill tone={b.published ? 'success' : 'warning'}>{b.published ? 'Published' : 'Draft'}</StatusPill>
                <StatusPill>{b.readingTime}</StatusPill>
                <StatusPill tone={b.coverImage ? 'success' : 'warning'}>{b.coverImage ? 'Cover ready' : 'Missing cover'}</StatusPill>
                <StatusPill>{b.category}</StatusPill>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Link href={`/blog/${b.slug}`} target="_blank" className="rounded-lg p-2 text-ink/50 hover:bg-muted hover:text-primary"><ExternalLink size={16} /></Link>
              <button onClick={() => startEdit(b)} className="rounded-lg p-2 text-ink/50 hover:bg-muted hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => remove(b._id)} className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
