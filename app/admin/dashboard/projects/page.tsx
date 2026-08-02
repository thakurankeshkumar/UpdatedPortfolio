'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { Project } from '@/types';
import { useCrud } from '@/hooks/use-crud';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { ImageListUploadField } from '@/components/admin/image-list-upload-field';
import { AdminHeader, AdminSearch, EmptyState, StatusPill } from '@/components/admin/admin-ui';

const empty: Partial<Project> & { tagsInput?: string } = {
  title: '', slug: '', summary: '', description: '', category: 'Web App',
  tagsInput: '', coverImage: '', gallery: [], challenges: '', solutions: '', githubUrl: '', liveUrl: '', featured: false, order: 0,
};

export default function ProjectsAdminPage() {
  const { items, loading, error, create, update, remove } = useCrud<Project>('/api/projects');
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  function startCreate() { setForm(empty); setEditingId(null); setOpen(true); }
  function startEdit(p: Project) {
    setForm({ ...p, gallery: p.gallery || [], tagsInput: p.techStack.join(', ') });
    setEditingId(p._id);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        techStack: (form.tagsInput || '').split(',').map((t: string) => t.trim()).filter(Boolean),
        gallery: (form.gallery || []).filter(Boolean),
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      };
      delete payload.tagsInput;
      if (editingId) await update(editingId, payload);
      else await create(payload);
      setOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  }

  const filtered = items.filter((p) => {
    const text = `${p.title} ${p.summary} ${p.category} ${p.techStack.join(' ')}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div>
      <AdminHeader
        title="Projects"
        description="Manage case studies, cover visuals, project gallery images, ordering, and featured work."
        count={`${items.length} project${items.length === 1 ? '' : 's'}`}
        action={<Button variant="primary" onClick={startCreate} className="w-full sm:w-auto"><Plus size={16} /> Add Project</Button>}
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearch value={query} onChange={setQuery} placeholder="Search projects..." />
        <Link href="/projects" target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          Public projects <ExternalLink size={14} />
        </Link>
      </div>

      {error && <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">{error}</p>}

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">{editingId ? 'Edit Project' : 'New Project'}</h2>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-ink/40 hover:bg-muted hover:text-ink"><X size={18} /></button>
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
          <div className="mt-4">
            <Label>Project gallery</Label>
            <p className="mb-2 text-xs text-ink/40">These images appear on the project detail page after challenge and solution.</p>
            <ImageListUploadField value={form.gallery || []} onChange={(gallery) => setForm({ ...form, gallery })} />
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
          {formError && <p className="mt-4 text-sm text-red-500">{formError}</p>}
          <Button type="submit" variant="primary" disabled={saving} className="mt-6 w-full sm:w-auto">{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Project'}</Button>
        </form>
      )}

      <div className="mt-8 grid gap-4">
        {loading && <p className="text-sm text-ink/40">Loading...</p>}
        {!loading && !filtered.length && <EmptyState title="No projects found" description="Add a project or clear your search to see all project entries." href="/projects" />}
        {filtered.map((p) => (
          <div key={p._id} className="grid gap-4 rounded-3xl border border-border bg-white p-4 shadow-soft md:grid-cols-[180px_1fr_auto] md:items-center">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted md:aspect-[4/3]">
              {p.coverImage ? (
                <Image src={p.coverImage} alt={p.title} fill sizes="180px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center font-heading text-3xl font-bold text-ink/10">{p.title.slice(0, 2).toUpperCase()}</div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-heading font-semibold text-ink">{p.title}</h3>
                {p.featured && <Star size={13} className="fill-primary text-primary" />}
              </div>
              <p className="mt-1 text-sm text-ink/50">{p.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill>{p.category}</StatusPill>
                <StatusPill tone={p.coverImage ? 'success' : 'warning'}>{p.coverImage ? 'Cover ready' : 'Missing cover'}</StatusPill>
                <StatusPill>{p.gallery?.length || 0} gallery</StatusPill>
                <StatusPill>Order {p.order || 0}</StatusPill>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Link href={`/projects/${p.slug}`} target="_blank" className="rounded-lg p-2 text-ink/50 hover:bg-muted hover:text-primary"><ExternalLink size={16} /></Link>
              <button onClick={() => startEdit(p)} className="rounded-lg p-2 text-ink/50 hover:bg-muted hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => remove(p._id)} className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
