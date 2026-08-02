'use client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function AdminHeader({
  title,
  description,
  count,
  action,
}: {
  title: string;
  description: string;
  count?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-bold text-ink md:text-3xl">{title}</h1>
          {count && <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/50 shadow-soft">{count}</span>}
        </div>
        <p className="mt-1 max-w-2xl text-sm text-ink/50">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function AdminSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-10" />
    </div>
  );
}

export function StatusPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        tone === 'success' && 'bg-success/10 text-success',
        tone === 'warning' && 'bg-accent/10 text-accent',
        tone === 'danger' && 'bg-red-50 text-red-500',
        tone === 'neutral' && 'bg-muted text-ink/50'
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, description, href }: { title: string; description: string; href?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-white p-8 text-center">
      <h2 className="font-heading text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/50">{description}</p>
      {href && (
        <Link href={href} className="mt-4 inline-flex text-sm font-semibold text-primary">
          Open public page
        </Link>
      )}
    </div>
  );
}
