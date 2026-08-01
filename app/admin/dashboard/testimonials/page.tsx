'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { Testimonial } from '@/types';
import { useCrud } from '@/hooks/use-crud';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const empty: any = { name: '', role: '', company: '', quote: '', rating: 5, order: 0 };

export default function TestimonialsAdminPage() {
  const { items, loading, create, update, remove } = useCrud<Testimonial>('/api/testimonials');
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function startCreate() { setForm(empty); setEditingId(null); setOpen(true); }
  function startEdit(t: Testimonial) { setForm(t); setEditingId(t._id); setOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) await update(editingId, form);
    else await create(form);
    setOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Testimonials</h1>
          <p className="mt-1 text-sm text-ink/50">{items.length} testimonial(s)</p>
        </div>
        <Button variant="primary" onClick={startCreate}><Plus size={16} /> Add Testimonial</Button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
            <button type="button" onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
            <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
          </div>
          <div className="mt-4"><Label>Quote</Label><Textarea required value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Label className="mb-0">Rating (1-5)</Label>
            <Input type="number" min={1} max={5} className="w-20" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
          </div>
          <Button type="submit" variant="primary" className="mt-6">{editingId ? 'Save Changes' : 'Add Testimonial'}</Button>
        </form>
      )}

      <div className="mt-8 grid gap-4">
        {loading && <p className="text-sm text-ink/40">Loading...</p>}
        {items.map((t) => (
          <div key={t._id} className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-ink">{t.name}</h3>
                <span className="flex text-primary">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</span>
              </div>
              <p className="mt-1 text-sm text-ink/50">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-1 text-xs text-ink/30">{t.role}{t.company ? ` · ${t.company}` : ''}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(t)} className="rounded-lg p-2 text-ink/50 hover:bg-muted hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => remove(t._id)} className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
