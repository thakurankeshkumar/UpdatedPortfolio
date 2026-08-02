'use client';
import { useCallback, useEffect, useState } from 'react';

export function useCrud<T extends { _id: string }>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load ${endpoint}`);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  async function create(payload: Partial<T>) {
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to create ${endpoint}`);
    await load();
  }

  async function update(id: string, payload: Partial<T>) {
    const res = await fetch(`${endpoint}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to update ${endpoint}/${id}`);
    await load();
  }

  async function remove(id: string) {
    const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE', cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to delete ${endpoint}/${id}`);
    await load();
  }

  return { items, loading, create, update, remove, reload: load };
}
