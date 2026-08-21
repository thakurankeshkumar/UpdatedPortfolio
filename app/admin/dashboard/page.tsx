'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, FolderKanban, FileText, Wrench, Quote, Mail, Settings, Images } from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-ui';

const CARDS = [
  { key: 'projects', label: 'Projects', endpoint: '/api/projects', href: '/admin/dashboard/projects', icon: FolderKanban },
  { key: 'blogs', label: 'Blog Posts', endpoint: '/api/blogs', href: '/admin/dashboard/blogs', icon: FileText },
  { key: 'services', label: 'Services', endpoint: '/api/services', href: '/admin/dashboard/services', icon: Wrench },
  { key: 'testimonials', label: 'Testimonials', endpoint: '/api/testimonials', href: '/admin/dashboard/testimonials', icon: Quote },
  { key: 'messages', label: 'Messages', endpoint: '/api/messages', href: '/admin/dashboard/messages', icon: Mail },
  { key: 'media', label: 'Media', endpoint: '/api/media', href: '/admin/dashboard/media', icon: Images },
];

export default function DashboardOverview() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    Promise.all(
      CARDS.map(async (c) => {
        const res = await fetch(c.endpoint, { cache: 'no-store' });
        const data = await res.json();
        return { key: c.key, data };
      })
    ).then((results) => {
      const next: Record<string, number> = {};
      results.forEach(({ key, data }) => {
        if (Array.isArray(data)) next[key] = data.length;
        if (data?.resources) next[key] = data.resources.length;
        if (key === 'messages' && Array.isArray(data)) setUnread(data.filter((item: any) => !item.read).length);
      });
      setCounts(next);
    }).catch(() => setCounts({}));
  }, []);

  return (
    <div>
      <AdminHeader
        title="Overview"
        description="Everything on your site, organized for quick edits and content health checks."
        action={
          <Link href="/admin/dashboard/settings" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-ink/60 shadow-soft hover:border-primary hover:text-primary">
            <Settings size={15} /> Site settings
          </Link>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {CARDS.map((c) => (
          <Link key={c.key} href={c.href} className="group rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon size={18} />
              </span>
              <ArrowUpRight size={16} className="text-ink/25 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
            </div>
            <div className="mt-5 font-heading text-3xl font-bold text-ink">{counts[c.key] ?? '-'}</div>
            <div className="mt-1 text-sm font-medium text-ink/55">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
          <h2 className="font-heading text-lg font-semibold text-ink">Management checklist</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Add project visuals', 'Upload cover and gallery images for every featured project.', '/admin/dashboard/projects'],
              ['Reuse media', 'Pick previous Cloudinary uploads instead of storing duplicate files.', '/admin/dashboard/media'],
              ['Keep writing fresh', 'Draft, publish, and attach blog cover images.', '/admin/dashboard/blogs'],
              ['Tune page copy', 'Update hero, page titles, resume, socials, and categories.', '/admin/dashboard/settings'],
              ['Follow up quickly', `${unread} unread message${unread === 1 ? '' : 's'} waiting.`, '/admin/dashboard/messages'],
            ].map(([title, text, href]) => (
              <Link key={title} href={href} className="rounded-2xl border border-border bg-muted/40 p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]">
                <div className="font-heading text-sm font-semibold text-ink">{title}</div>
                <p className="mt-1 text-xs leading-relaxed text-ink/50">{text}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-dark p-6 text-white shadow-lift">
          <h2 className="font-heading text-lg font-semibold">Live site</h2>
          <p className="mt-2 text-sm text-white/50">Review the public website after content changes so image crops, titles, and call-to-actions feel right.</p>
          <a href="/" target="_blank" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-dark">
            View site <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
