'use client';
import { useEffect, useState } from 'react';
import { FolderKanban, FileText, Wrench, Quote, Mail } from 'lucide-react';

const CARDS = [
  { key: 'projects', label: 'Projects', endpoint: '/api/projects', icon: FolderKanban },
  { key: 'blogs', label: 'Blog Posts', endpoint: '/api/blogs', icon: FileText },
  { key: 'services', label: 'Services', endpoint: '/api/services', icon: Wrench },
  { key: 'testimonials', label: 'Testimonials', endpoint: '/api/testimonials', icon: Quote },
  { key: 'messages', label: 'Messages', endpoint: '/api/messages', icon: Mail },
];

export default function DashboardOverview() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    CARDS.forEach(async (c) => {
      const res = await fetch(c.endpoint);
      const data = await res.json();
      setCounts((prev) => ({ ...prev, [c.key]: Array.isArray(data) ? data.length : 0 }));
    });
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Overview</h1>
      <p className="mt-1 text-sm text-ink/50">Everything on your site, at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CARDS.map((c) => (
          <div key={c.key} className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <c.icon size={18} className="mb-4 text-primary" />
            <div className="font-heading text-2xl font-bold text-ink">{counts[c.key] ?? '—'}</div>
            <div className="mt-1 text-xs text-ink/50">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
