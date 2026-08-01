'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { BlogPost } from '@/types';
import { useCrud } from '@/hooks/use-crud';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploadField } from '@/components/admin/image-upload-field';

const empty: any = {
  title: '', slug: '', excerpt: '', content: '', coverImage: '', category: 'General', tagsInput: '', readingTime: '3 min read', published: true,
};

function estimateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function BlogsAdminPage() {
  const { items, loading, create, update, remove } = useCrud<BlogPost>('/api/blogs');
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function startCreate() { setForm(empty); setEditingId(null); setOpen(true); }
  function startEdit(b: BlogPost) {
    setForm({ ...b, tagsInput: b.tags.join(', ') });
    setEditingId(b._id);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Blog Posts</h1>
          <p className="mt-1 text-sm text-ink/50">{items.length} post(s)</p>
        </div>
        <Button variant="primary" onClick={startCreate}><Plus size={16} /> Add Post</Button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">{editingId ? 'Edit Post' : 'New Post'}</h2>
            <button type="button" onClick={() => setOpen(false)}><X size={18} /></button>
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
          <Button type="submit" variant="primary" className="mt-6">{editingId ? 'Save Changes' : 'Publish Post'}</Button>
        </form>
      )}

      <div className="mt-8 grid gap-4">
        {loading && <p className="text-sm text-ink/40">Loading...</p>}
        {items.map((b) => (
          <div key={b._id} className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
            <div>
              <h3 className="font-heading font-semibold text-ink">{b.title}</h3>
              <p className="mt-1 text-sm text-ink/50">{b.excerpt}</p>
              <p className="mt-1 text-xs text-ink/30">{b.published ? 'Published' : 'Draft'} · {b.readingTime}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(b)} className="rounded-lg p-2 text-ink/50 hover:bg-muted hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => remove(b._id)} className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
