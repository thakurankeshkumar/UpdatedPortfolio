'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { Testimonial } from '@/types';
import { useCrud } from '@/hooks/use-crud';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminHeader, AdminSearch, EmptyState, StatusPill } from '@/components/admin/admin-ui';
import { ImageUploadField } from '@/components/admin/image-upload-field';

const empty: any = { name: '', role: '', company: '', avatar: '', quote: '', rating: 5, order: 0 };

export default function TestimonialsAdminPage() {
  const { items, loading, error, create, update, remove } = useCrud<Testimonial>('/api/testimonials');
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  function startCreate() { setForm(empty); setEditingId(null); setOpen(true); }
  function startEdit(t: Testimonial) { setForm(t); setEditingId(t._id); setOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingId) await update(editingId, form);
      else await create(form);
      setOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  }

  const filtered = items.filter((t) => `${t.name} ${t.role} ${t.company} ${t.quote}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AdminHeader
        title="Testimonials"
        description="Manage client quotes, ratings, attribution, and social proof ordering."
        count={`${items.length} testimonial${items.length === 1 ? '' : 's'}`}
        action={<Button variant="primary" onClick={startCreate} className="w-full sm:w-auto"><Plus size={16} /> Add Testimonial</Button>}
      />
      <div className="mt-6"><AdminSearch value={query} onChange={setQuery} placeholder="Search testimonials..." /></div>
      {error && <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">{error}</p>}

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-ink/40 hover:bg-muted hover:text-ink"><X size={18} /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
            <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
          </div>
          <div className="mt-4">
            <Label>Avatar</Label>
            <ImageUploadField value={form.avatar || ''} onChange={(url) => setForm({ ...form, avatar: url })} />
          </div>
          <div className="mt-4"><Label>Quote</Label><Textarea required value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <Label className="mb-0">Rating (1-5)</Label>
            <Input type="number" min={1} max={5} className="w-20" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            <Label className="mb-0">Order</Label>
            <Input type="number" className="w-20" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          </div>
          {formError && <p className="mt-4 text-sm text-red-500">{formError}</p>}
          <Button type="submit" variant="primary" disabled={saving} className="mt-6 w-full sm:w-auto">{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Testimonial'}</Button>
        </form>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {loading && <p className="text-sm text-ink/40">Loading...</p>}
        {!loading && !filtered.length && <EmptyState title="No testimonials found" description="Add a testimonial or clear your search to see all quotes." />}
        {filtered.map((t) => (
          <div key={t._id} className="rounded-3xl border border-border bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-ink">{t.name}</h3>
                <span className="flex text-primary">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</span>
              </div>
              <p className="mt-1 text-sm text-ink/50">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill>{t.role || 'No role'}</StatusPill>
                {t.company && <StatusPill>{t.company}</StatusPill>}
                <StatusPill>Order {t.order || 0}</StatusPill>
              </div>
              </div>
              <div className="flex shrink-0 gap-2">
              <button onClick={() => startEdit(t)} className="rounded-lg p-2 text-ink/50 hover:bg-muted hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => remove(t._id)} className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
