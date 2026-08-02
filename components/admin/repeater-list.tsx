'use client';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploadField } from '@/components/admin/image-upload-field';

export interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'image';
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
  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((item, i) => ({ ...item, order: i + 1 })));
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-border bg-muted/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/40">
              <GripVertical size={13} /> {itemLabel} {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="rounded-lg px-2 py-1 text-xs font-semibold text-ink/40 hover:bg-white hover:text-primary disabled:opacity-30">
                Up
              </button>
              <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="rounded-lg px-2 py-1 text-xs font-semibold text-ink/40 hover:bg-white hover:text-primary disabled:opacity-30">
                Down
              </button>
              <button type="button" onClick={() => removeItem(i)} className="rounded-lg p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <Label className="text-xs">{f.label}</Label>
                {f.type === 'image' ? (
                  <ImageUploadField value={item[f.key] ?? ''} onChange={(url) => updateItem(i, f.key, url)} />
                ) : f.type === 'textarea' ? (
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
