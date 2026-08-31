import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!supabaseConfigured) {
      setLoading(false);
      setError('Supabase לא מוגדר עדיין. עדכן/י את .env.local (ראה/י README).');
      return;
    }
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setError(null);
      setProducts(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    if (!supabaseConfigured) return;

    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          setProducts((current) => {
            if (payload.eventType === 'DELETE') {
              return current.filter((p) => p.id !== payload.old.id);
            }
            const incoming = payload.new;
            const exists = current.some((p) => p.id === incoming.id);
            if (exists) {
              return current
                .map((p) => (p.id === incoming.id ? incoming : p))
                .sort((a, b) => a.id - b.id);
            }
            return [...current, incoming].sort((a, b) => a.id - b.id);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  // Optimistic local update + fire-and-forget write to Supabase.
  const updateProduct = useCallback((id, patch) => {
    setProducts((current) =>
      current.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
    if (!supabaseConfigured) return;
    supabase
      .from('products')
      .update(patch)
      .eq('id', id)
      .then(({ error: updateError }) => {
        if (updateError) {
          console.error('עדכון מוצר נכשל:', updateError.message);
          // Roll back to last known server state.
          fetchAll();
        }
      });
  }, [fetchAll]);

  const resetCounts = useCallback(async () => {
    if (!supabaseConfigured) return;
    const { error: resetError } = await supabase
      .from('products')
      .update({ bar_stock: 0, storage_boxes: 0, storage_singles: 0 })
      .neq('id', -1);
    if (resetError) {
      setError(resetError.message);
    } else {
      fetchAll();
    }
  }, [fetchAll]);

  return { products, loading, error, updateProduct, resetCounts, refresh: fetchAll };
}
