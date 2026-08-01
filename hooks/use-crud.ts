'use client';
import { useCallback, useEffect, useState } from 'react';

export function useCrud<T extends { _id: string }>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(endpoint);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  async function create(payload: Partial<T>) {
    await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    await load();
  }

  async function update(id: string, payload: Partial<T>) {
    await fetch(`${endpoint}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    await load();
  }

  async function remove(id: string) {
    await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
    await load();
  }

  return { items, loading, create, update, remove, reload: load };
}
