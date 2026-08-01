'use client';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number';
  placeholder?: string;
}

export function RepeaterList<T extends Record<string, any>>({
  items,
  onChange,
  fields,
  newItem,
  itemLabel = 'Item',
}: {
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldConfig[];
  newItem: T;
  itemLabel?: string;
}) {
  function updateItem(index: number, key: string, value: any) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }
  function addItem() {
    onChange([...items, { ...newItem, order: items.length + 1 }]);
  }
  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-border bg-muted/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/40">
              <GripVertical size={13} /> {itemLabel} {i + 1}
            </span>
            <button type="button" onClick={() => removeItem(i)} className="rounded-lg p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-500">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <Label className="text-xs">{f.label}</Label>
                {f.type === 'textarea' ? (
                  <Textarea
                    value={item[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => updateItem(i, f.key, e.target.value)}
                    className="min-h-[70px]"
                  />
                ) : (
                  <Input
                    type={f.type === 'number' ? 'number' : 'text'}
                    value={item[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => updateItem(i, f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus size={14} /> Add {itemLabel}
      </Button>
    </div>
  );
}
