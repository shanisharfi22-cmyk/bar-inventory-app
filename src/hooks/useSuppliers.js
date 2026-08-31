import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState({}); // name -> phone

  const fetchAll = useCallback(async () => {
    if (!supabaseConfigured) return;
    const { data, error } = await supabase.from('suppliers').select('*');
    if (!error && data) {
      const map = {};
      for (const s of data) map[s.name] = s.phone || '';
      setSuppliers(map);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const setSupplierPhone = useCallback((name, phone) => {
    setSuppliers((current) => ({ ...current, [name]: phone }));
    if (!supabaseConfigured) return;
    supabase.from('suppliers').upsert({ name, phone }).then(({ error }) => {
      if (error) console.error('שמירת טלפון ספק נכשלה:', error.message);
    });
  }, []);

  return { suppliers, setSupplierPhone };
}
