'use client';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function TagListEditor({ items, onChange, placeholder = 'Add item...' }: { items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('');

  function add() {
    const v = draft.trim();
    if (!v || items.includes(v)) return;
    onChange([...items, v]);
    setDraft('');
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-ink/70">
            {item}
            <button type="button" onClick={() => onChange(items.filter((i) => i !== item))} className="text-ink/40 hover:text-red-500">
              <X size={12} />
            </button>
          </span>
        ))}
        {!items.length && <span className="text-xs text-ink/30">No items yet</span>}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        />
        <button type="button" onClick={add} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-ink/60 hover:border-primary hover:text-primary">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
