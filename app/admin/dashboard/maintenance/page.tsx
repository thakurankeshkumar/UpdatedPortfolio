'use client';

import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Eye, Gauge, Loader2, Power, Save, ShieldCheck, Sparkles } from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-ui';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

const ACCENTS = [
  { value: 'violet', label: 'Ultraviolet', className: 'from-violet-500 via-fuchsia-500 to-pink-500' },
  { value: 'cyan', label: 'Electric cyan', className: 'from-cyan-400 via-blue-500 to-indigo-600' },
  { value: 'rose', label: 'Solar rose', className: 'from-rose-500 via-orange-400 to-amber-400' },
];

export default function MaintenancePage() {
  const { show } = useToast();
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setSettings)
      .catch(() => show('Could not load maintenance settings.', 'error'));
  }, [show]);

  function set(key: string, value: unknown) {
    setSettings((current: any) => ({ ...current, [key]: value }));
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maintenanceMode: settings.maintenanceMode,
          maintenanceTitle: settings.maintenanceTitle,
          maintenanceMessage: settings.maintenanceMessage,
          maintenanceExpectedReturn: settings.maintenanceExpectedReturn,
          maintenanceProgress: Math.min(100, Math.max(0, Number(settings.maintenanceProgress) || 0)),
          maintenanceShowProgress: settings.maintenanceShowProgress,
          maintenanceAccent: settings.maintenanceAccent,
        }),
      });
      if (!response.ok) throw new Error();
      show(settings.maintenanceMode ? 'Maintenance mode is live.' : 'Maintenance mode is off — your site is live.');
    } catch {
      show('Could not save maintenance settings.', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <p className="text-sm text-ink/40">Loading maintenance controls...</p>;
  const accent = ACCENTS.find((item) => item.value === settings.maintenanceAccent) || ACCENTS[0];
  const progress = Math.min(100, Math.max(0, Number(settings.maintenanceProgress) || 0));

  return <div className="max-w-5xl">
    <AdminHeader title="Maintenance Control Room" description="A protected public-site kill switch, with a tailored visitor experience and a secure route back for you." />

    <section className={`mt-8 overflow-hidden rounded-3xl bg-gradient-to-br ${accent.className} p-[1px] shadow-card`}>
      <div className="grid gap-6 rounded-[23px] bg-dark p-6 text-white md:grid-cols-[1.2fr_.8fr] md:p-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/55"><Activity size={14} /> System status</div>
          <h2 className="mt-4 font-heading text-3xl font-bold">{settings.maintenanceMode ? 'Maintenance is active' : 'Everything is live'}</h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">{settings.maintenanceMode ? 'Visitors are sent to your custom maintenance page. Public content and APIs remain unavailable.' : 'Your normal site is open. Turn on maintenance whenever you need a quiet window to ship changes.'}</p>
          <label className="mt-7 inline-flex cursor-pointer items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur">
            <input type="checkbox" checked={settings.maintenanceMode === true} onChange={(event) => set('maintenanceMode', event.target.checked)} className="h-4 w-4 accent-white" />
            <Power size={16} /> {settings.maintenanceMode ? 'Maintenance mode enabled' : 'Enable maintenance mode'}
          </label>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={17} className="text-emerald-300" /> Protected while active</div>
          <div className="mt-5 space-y-3 text-sm text-white/65">
            <p className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" /> Public routes redirect to the maintenance page.</p>
            <p className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" /> Contact details, navigation, and footer stay hidden.</p>
            <p className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" /> Your secret contact-code login remains available.</p>
          </div>
          <a href="/contact" target="_blank" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/70"><Eye size={16} /> Preview visitor page</a>
        </div>
      </div>
    </section>

    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-3xl border border-border bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2"><Sparkles size={18} className="text-primary" /><h2 className="font-heading font-semibold text-ink">Visitor experience</h2></div>
        <p className="mt-1 text-sm text-ink/50">The only information visitors see during maintenance, beside the message form.</p>
        <div className="mt-6 space-y-5">
          <div><Label htmlFor="maintenanceTitle">Headline</Label><Input id="maintenanceTitle" value={settings.maintenanceTitle || ''} maxLength={100} onChange={(event) => set('maintenanceTitle', event.target.value)} /></div>
          <div><Label htmlFor="maintenanceMessage">Update message</Label><Textarea id="maintenanceMessage" value={settings.maintenanceMessage || ''} maxLength={280} onChange={(event) => set('maintenanceMessage', event.target.value)} /></div>
          <div><Label htmlFor="maintenanceExpectedReturn">Expected return label</Label><Input id="maintenanceExpectedReturn" value={settings.maintenanceExpectedReturn || ''} maxLength={80} placeholder="Back online soon" onChange={(event) => set('maintenanceExpectedReturn', event.target.value)} /></div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2"><Gauge size={18} className="text-primary" /><h2 className="font-heading font-semibold text-ink">Visual signal</h2></div>
        <p className="mt-1 text-sm text-ink/50">Set the mood and let visitors know work is moving forward.</p>
        <div className="mt-6"><Label>Accent energy</Label><div className="mt-2 grid grid-cols-3 gap-2">{ACCENTS.map((item) => <button key={item.value} type="button" onClick={() => set('maintenanceAccent', item.value)} className={`rounded-xl border p-2 text-left ${settings.maintenanceAccent === item.value ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}><span className={`block h-7 rounded-lg bg-gradient-to-r ${item.className}`} /><span className="mt-2 block text-xs font-medium text-ink">{item.label}</span></button>)}</div></div>
        <label className="mt-6 flex cursor-pointer items-center justify-between rounded-2xl bg-muted p-4 text-sm font-medium text-ink"><span>Show build progress</span><input type="checkbox" checked={settings.maintenanceShowProgress !== false} onChange={(event) => set('maintenanceShowProgress', event.target.checked)} className="h-4 w-4 accent-primary" /></label>
        {settings.maintenanceShowProgress !== false && <div className="mt-5"><div className="flex justify-between text-sm"><Label htmlFor="maintenanceProgress">Progress</Label><span className="font-semibold text-primary">{progress}%</span></div><input id="maintenanceProgress" type="range" min="0" max="100" value={progress} onChange={(event) => set('maintenanceProgress', event.target.value)} className="mt-3 w-full accent-primary" /></div>}
      </section>
    </div>

    <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-border bg-white p-4 shadow-soft sm:flex-row sm:items-center"><p className="text-sm text-ink/55">Changes are saved only when you press the button. The switch takes effect immediately after saving.</p><Button onClick={save} variant="primary" disabled={saving} className="w-full sm:w-auto">{saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save control room</>}</Button></div>
  </div>;
}
