'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Service } from '@/types';
import { useCrud } from '@/hooks/use-crud';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminHeader, AdminSearch, EmptyState, StatusPill } from '@/components/admin/admin-ui';

const ICONS = ['Code2', 'Globe', 'Layers', 'Server', 'LayoutDashboard', 'Gauge', 'Wrench', 'Rocket', 'Database'];

const empty: any = { title: '', description: '', featuresInput: '', timeline: '1-2 weeks', startingPrice: '$299', icon: 'Code2', order: 0 };

export default function ServicesAdminPage() {
  const { items, loading, error, create, update, remove } = useCrud<Service>('/api/services');
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  function startCreate() { setForm(empty); setEditingId(null); setOpen(true); }
  function startEdit(s: Service) {
    setForm({ ...s, featuresInput: s.features.join(', ') });
    setEditingId(s._id);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        features: (form.featuresInput || '').split(',').map((f: string) => f.trim()).filter(Boolean),
      };
      delete payload.featuresInput;
      if (editingId) await update(editingId, payload);
      else await create(payload);
      setOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  }

  const filtered = items.filter((s) => `${s.title} ${s.description} ${s.features.join(' ')}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AdminHeader
        title="Services"
        description="Manage offers, feature bullets, pricing hints, timelines, icons, and display order."
        count={`${items.length} service${items.length === 1 ? '' : 's'}`}
        action={<Button variant="primary" onClick={startCreate} className="w-full sm:w-auto"><Plus size={16} /> Add Service</Button>}
      />
      <div className="mt-6"><AdminSearch value={query} onChange={setQuery} placeholder="Search services..." /></div>
      {error && <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">{error}</p>}

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">{editingId ? 'Edit Service' : 'New Service'}</h2>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-ink/40 hover:bg-muted hover:text-ink"><X size={18} /></button>
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
          {formError && <p className="mt-4 text-sm text-red-500">{formError}</p>}
          <Button type="submit" variant="primary" disabled={saving} className="mt-6 w-full sm:w-auto">{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Service'}</Button>
        </form>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {loading && <p className="text-sm text-ink/40">Loading...</p>}
        {!loading && !filtered.length && <EmptyState title="No services found" description="Create a service or clear your search to see all service cards." />}
        {filtered.map((s) => (
          <div key={s._id} className="rounded-3xl border border-border bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
              <h3 className="font-heading font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-ink/50">{s.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
              <button onClick={() => startEdit(s)} className="rounded-lg p-2 text-ink/50 hover:bg-muted hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => remove(s._id)} className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusPill>From {s.startingPrice}</StatusPill>
              <StatusPill>{s.timeline}</StatusPill>
              <StatusPill>{s.features?.length || 0} features</StatusPill>
              <StatusPill>Order {s.order || 0}</StatusPill>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
