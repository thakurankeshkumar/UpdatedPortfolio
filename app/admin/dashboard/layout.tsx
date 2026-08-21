'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, FileText, Wrench, Quote, Mail, LogOut, ExternalLink, Settings, Menu, X, Images } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/dashboard/projects', icon: FolderKanban },
  { label: 'Blog', href: '/admin/dashboard/blogs', icon: FileText },
  { label: 'Services', href: '/admin/dashboard/services', icon: Wrench },
  { label: 'Testimonials', href: '/admin/dashboard/testimonials', icon: Quote },
  { label: 'Media Library', href: '/admin/dashboard/media', icon: Images },
  { label: 'Messages', href: '/admin/dashboard/messages', icon: Mail },
  { label: 'Site Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const nav = (
    <>
      <Link href="/" className="mb-8 block font-heading text-lg font-semibold text-ink">
        Ankesh<span className="text-primary">.</span> <span className="text-xs font-normal text-ink/40">admin</span>
      </Link>
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-primary text-white shadow-soft' : 'text-ink/60 hover:bg-muted hover:text-ink'
              )}
            >
              <item.icon size={16} /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 space-y-1 border-t border-border pt-4">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink/60 hover:bg-muted hover:text-ink">
          <ExternalLink size={16} /> View site
        </a>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50">
          <LogOut size={16} /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur md:hidden">
        <Link href="/admin/dashboard" className="font-heading text-base font-semibold text-ink">
          Ankesh<span className="text-primary">.</span> admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-xl border border-border p-2 text-ink/60"
          aria-label="Toggle admin menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-20 bg-dark/30 md:hidden" onClick={() => setOpen(false)}>
          <aside className="flex h-full w-[min(82vw,320px)] flex-col border-r border-border bg-white p-5" onClick={(e) => e.stopPropagation()}>
            {nav}
          </aside>
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-white p-6 md:flex">
        {nav}
      </aside>
      <main className="overflow-x-hidden px-4 py-6 sm:px-6 md:ml-64 md:p-10 lg:p-12">{children}</main>
    </div>
  );
}
