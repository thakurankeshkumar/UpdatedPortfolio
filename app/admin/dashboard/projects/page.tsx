'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { Project } from '@/types';
import { useCrud } from '@/hooks/use-crud';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploadField } from '@/components/admin/image-upload-field';

const empty: Partial<Project> & { tagsInput?: string } = {
  title: '', slug: '', summary: '', description: '', category: 'Web App',
  tagsInput: '', coverImage: '', challenges: '', solutions: '', githubUrl: '', liveUrl: '', featured: false, order: 0,
};

export default function ProjectsAdminPage() {
  const { items, loading, create, update, remove } = useCrud<Project>('/api/projects');
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function startCreate() { setForm(empty); setEditingId(null); setOpen(true); }
  function startEdit(p: Project) {
    setForm({ ...p, tagsInput: p.techStack.join(', ') });
    setEditingId(p._id);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: (form.tagsInput || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
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
          <h1 className="font-heading text-2xl font-bold text-ink">Projects</h1>
          <p className="mt-1 text-sm text-ink/50">{items.length} project(s)</p>
        </div>
        <Button variant="primary" onClick={startCreate}><Plus size={16} /> Add Project</Button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">{editingId ? 'Edit Project' : 'New Project'}</h2>
            <button type="button" onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Title</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Slug (auto-generated if blank)</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-project" />
            </div>
          </div>
          <div className="mt-4">
            <Label>Summary (short, for cards)</Label>
            <Input required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </div>
          <div className="mt-4">
            <Label>Full description (markdown supported)</Label>
            <Textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. SaaS" />
              <p className="mt-1 text-xs text-ink/40">Manage the filter list shown on the Projects page from Site Settings → Page Copy.</p>
            </div>
            <div>
              <Label>Tech stack (comma separated)</Label>
              <Input value={form.tagsInput} onChange={(e) => setForm({ ...form, tagsInput: e.target.value })} placeholder="Next.js, MongoDB" />
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div><Label>GitHub URL</Label><Input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} /></div>
            <div><Label>Live URL</Label><Input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} /></div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div><Label>Challenge (optional)</Label><Textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} /></div>
            <div><Label>Solution (optional)</Label><Textarea value={form.solutions} onChange={(e) => setForm({ ...form, solutions: e.target.value })} /></div>
          </div>
          <div className="mt-4">
            <Label>Cover image</Label>
            <ImageUploadField value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />
          </div>
          <div className="mt-4 flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
            </label>
            <div className="flex items-center gap-2 text-sm">
              <Label className="mb-0">Order</Label>
              <Input type="number" className="w-20" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
          </div>
          <Button type="submit" variant="primary" className="mt-6">{editingId ? 'Save Changes' : 'Create Project'}</Button>
        </form>
      )}

      <div className="mt-8 grid gap-4">
        {loading && <p className="text-sm text-ink/40">Loading...</p>}
        {items.map((p) => (
          <div key={p._id} className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-ink">{p.title}</h3>
                {p.featured && <Star size={13} className="fill-primary text-primary" />}
              </div>
              <p className="mt-1 text-sm text-ink/50">{p.summary}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="rounded-lg p-2 text-ink/50 hover:bg-muted hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => remove(p._id)} className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
