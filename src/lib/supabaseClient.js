import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(
  url && anonKey && !url.includes('YOUR-PROJECT-REF') && !anonKey.includes('YOUR-ANON')
);

// When the real project isn't configured yet we still create a client so the
// rest of the app can render; every call will simply fail until .env.local
// is filled in (see README "חיבור ל-Supabase").
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key'
);
