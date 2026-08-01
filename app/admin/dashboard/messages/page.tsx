'use client';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { Message } from '@/types';
import { useCrud } from '@/hooks/use-crud';

export default function MessagesAdminPage() {
  const { items, loading, update, remove } = useCrud<Message>('/api/messages');

  return (
    <div>
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Messages</h1>
        <p className="mt-1 text-sm text-ink/50">{items.length} message(s) from the contact form</p>
      </div>

      <div className="mt-8 grid gap-4">
        {loading && <p className="text-sm text-ink/40">Loading...</p>}
        {!loading && !items.length && <p className="text-sm text-ink/40">No messages yet.</p>}
        {items.map((m) => (
          <div key={m._id} className={`rounded-2xl border p-6 ${m.read ? 'border-border bg-white' : 'border-primary/30 bg-primary/[0.03]'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {m.read ? <MailOpen size={15} className="text-ink/30" /> : <Mail size={15} className="text-primary" />}
                  <h3 className="font-heading font-semibold text-ink">{m.name}</h3>
                  <span className="text-xs text-ink/40">&lt;{m.email}&gt;</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-ink/40">
                  {m.company && <span>{m.company}</span>}
                  {m.projectType && <span>· {m.projectType}</span>}
                  {m.budget && <span>· {m.budget}</span>}
                  <span>· {new Date(m.createdAt).toLocaleDateString()}</span>
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
            <a href={`mailto:${m.email}`} className="mt-4 inline-block text-xs font-semibold text-primary">Reply by email →</a>
          </div>
        ))}
      </div>
    </div>
  );
}
