'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Service } from '@/types';
import { useCrud } from '@/hooks/use-crud';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ICONS = ['Code2', 'Globe', 'Layers', 'Server', 'LayoutDashboard', 'Gauge', 'Wrench', 'Rocket', 'Database'];

const empty: any = { title: '', description: '', featuresInput: '', timeline: '1-2 weeks', startingPrice: '$299', icon: 'Code2', order: 0 };

export default function ServicesAdminPage() {
  const { items, loading, create, update, remove } = useCrud<Service>('/api/services');
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function startCreate() { setForm(empty); setEditingId(null); setOpen(true); }
  function startEdit(s: Service) {
    setForm({ ...s, featuresInput: s.features.join(', ') });
    setEditingId(s._id);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      features: (form.featuresInput || '').split(',').map((f: string) => f.trim()).filter(Boolean),
    };
    delete payload.featuresInput;
    if (editingId) await update(editingId, payload);
    else await create(payload);
    setOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Services</h1>
          <p className="mt-1 text-sm text-ink/50">{items.length} service(s)</p>
        </div>
        <Button variant="primary" onClick={startCreate}><Plus size={16} /> Add Service</Button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">{editingId ? 'Edit Service' : 'New Service'}</h2>
            <button type="button" onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="mt-4"><Label>Description</Label><Textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="mt-4"><Label>Features (comma separated)</Label><Input value={form.featuresInput} onChange={(e) => setForm({ ...form, featuresInput: e.target.value })} /></div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div><Label>Timeline</Label><Input value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} /></div>
            <div><Label>Starting price</Label><Input value={form.startingPrice} onChange={(e) => setForm({ ...form, startingPrice: e.target.value })} /></div>
            <div>
              <Label>Icon</Label>
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="h-11 w-full rounded-xl border border-border px-4 text-sm">
                {ICONS.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Label className="mb-0">Order</Label>
            <Input type="number" className="w-20" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          </div>
          <Button type="submit" variant="primary" className="mt-6">{editingId ? 'Save Changes' : 'Create Service'}</Button>
        </form>
      )}

      <div className="mt-8 grid gap-4">
        {loading && <p className="text-sm text-ink/40">Loading...</p>}
        {items.map((s) => (
          <div key={s._id} className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
            <div>
              <h3 className="font-heading font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-ink/50">{s.description}</p>
              <p className="mt-1 text-xs text-ink/30">From {s.startingPrice} · {s.timeline}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(s)} className="rounded-lg p-2 text-ink/50 hover:bg-muted hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => remove(s._id)} className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
