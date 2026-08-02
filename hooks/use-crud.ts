'use client';
import { useCallback, useEffect, useState } from 'react';

export function useCrud<T extends { _id: string }>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(endpoint, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to load ${endpoint}`);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  async function create(payload: Partial<T>) {
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed to create ${endpoint}`);
    await load();
  }

  async function update(id: string, payload: Partial<T>) {
    const res = await fetch(`${endpoint}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed to update ${endpoint}/${id}`);
    await load();
  }

  async function remove(id: string) {
    const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE', cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed to delete ${endpoint}/${id}`);
    await load();
  }

  return { items, loading, error, create, update, remove, reload: load };
}
