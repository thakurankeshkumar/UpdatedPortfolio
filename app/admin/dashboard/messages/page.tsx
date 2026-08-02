'use client';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { Message } from '@/types';
import { useCrud } from '@/hooks/use-crud';
import { AdminHeader, AdminSearch, EmptyState, StatusPill } from '@/components/admin/admin-ui';
import { useState } from 'react';

export default function MessagesAdminPage() {
  const { items, loading, error, update, remove } = useCrud<Message>('/api/messages');
  const [query, setQuery] = useState('');

  const unread = items.filter((m) => !m.read).length;
  const filtered = items.filter((m) => `${m.name} ${m.email} ${m.company || ''} ${m.projectType || ''} ${m.budget || ''} ${m.message}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AdminHeader
        title="Messages"
        description="Read contact form submissions, track unread requests, and jump straight into email replies."
        count={`${unread} unread`}
      />

      <div className="mt-6"><AdminSearch value={query} onChange={setQuery} placeholder="Search messages..." /></div>
      {error && <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">{error}</p>}

      <div className="mt-8 grid gap-4">
        {loading && <p className="text-sm text-ink/40">Loading...</p>}
        {!loading && !filtered.length && <EmptyState title="No messages found" description="New contact messages will appear here, or clear your search to see every message." />}
        {filtered.map((m) => (
          <div key={m._id} className={`rounded-3xl border p-5 shadow-soft md:p-6 ${m.read ? 'border-border bg-white' : 'border-primary/30 bg-primary/[0.03]'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {m.read ? <MailOpen size={15} className="text-ink/30" /> : <Mail size={15} className="text-primary" />}
                  <h3 className="font-heading font-semibold text-ink">{m.name}</h3>
                </div>
                <a href={`mailto:${m.email}`} className="mt-1 inline-block text-xs font-semibold text-primary">{m.email}</a>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusPill tone={m.read ? 'neutral' : 'success'}>{m.read ? 'Read' : 'Unread'}</StatusPill>
                  {m.company && <StatusPill>{m.company}</StatusPill>}
                  {m.projectType && <StatusPill>{m.projectType}</StatusPill>}
                  {m.budget && <StatusPill>{m.budget}</StatusPill>}
                  <StatusPill>{new Date(m.createdAt).toLocaleDateString()}</StatusPill>
                </div>
              </div>
              <div className="flex gap-2">
                {!m.read && (
                  <button onClick={() => update(m._id, { read: true } as any)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink/60 hover:border-primary hover:text-primary">
                    Mark read
                  </button>
                )}
                <button onClick={() => remove(m._id)} className="rounded-lg p-2 text-ink/40 hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm text-ink/70">{m.message}</p>
            <a href={`mailto:${m.email}?subject=Re: Your message from Ankesh's website`} className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">Reply by email</a>
          </div>
        ))}
      </div>
    </div>
  );
}
