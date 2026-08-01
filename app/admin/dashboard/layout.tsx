'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, FileText, Wrench, Quote, Mail, LogOut, ExternalLink, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/dashboard/projects', icon: FolderKanban },
  { label: 'Blog', href: '/admin/dashboard/blogs', icon: FileText },
  { label: 'Services', href: '/admin/dashboard/services', icon: Wrench },
  { label: 'Testimonials', href: '/admin/dashboard/testimonials', icon: Quote },
  { label: 'Messages', href: '/admin/dashboard/messages', icon: Mail },
  { label: 'Site Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white p-6 md:flex">
        <Link href="/" className="mb-10 font-heading text-lg font-semibold text-ink">
          Ankesh<span className="text-primary">.</span> <span className="text-xs font-normal text-ink/40">admin</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-primary text-white' : 'text-ink/60 hover:bg-muted'
                )}
              >
                <item.icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-border pt-4">
          <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink/60 hover:bg-muted">
            <ExternalLink size={16} /> View site
          </a>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6 md:p-10">{children}</main>
    </div>
  );
}
