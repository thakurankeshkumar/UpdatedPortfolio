'use client';
import Link from 'next/link';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/constants';
import { SiteSettings } from '@/types/settings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export function Footer({ settings }: { settings?: SiteSettings }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const socials = settings?.footerSocials?.length ? settings.footerSocials : [];
  const tagline = settings?.footerTagline || settings?.tagline || SITE.description;
  const copyright = settings?.footerCopyright || `© ${new Date().getFullYear()} ${settings?.siteName || SITE.name}. All rights reserved.`;

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      show('Subscribed! Thanks for following along.');
      setEmail('');
    } catch {
      show('Something went wrong. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-border bg-dark text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />

      <div className="container relative grid gap-12 py-20 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="font-heading text-2xl font-semibold">
            {settings?.logoText || 'Ankesh'}<span className="text-primary">.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/50">{tagline}</p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Navigate</h4>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="text-sm text-white/60 hover:text-primary">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Connect</h4>
          <ul className="space-y-2.5">
            {socials.map((s, i) => {
              const Icon = (Icons as any)[s.icon] || ArrowUpRight;
              return (
                <li key={s.label || i}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-white/60 hover:text-primary">
                    <Icon size={14} /> {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Stay in the loop</h4>
          <p className="mb-3 text-sm text-white/50">New projects and dev write-ups, occasionally.</p>
          <form onSubmit={subscribe} className="flex gap-2">
            <Input
              type="email" required placeholder="you@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
            <Button type="submit" variant="primary" disabled={loading}>{loading ? '...' : 'Join'}</Button>
          </form>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-white/40 sm:flex-row">
          <span>{copyright}</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
