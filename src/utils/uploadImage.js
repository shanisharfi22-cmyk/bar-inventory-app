import { supabase, supabaseConfigured } from '../lib/supabaseClient';

const BUCKET = 'product-images';

export async function uploadProductImage(productId, file) {
  if (!supabaseConfigured) {
    throw new Error('Supabase לא מוגדר עדיין.');
  }
  const ext = file.name.split('.').pop();
  const path = `${productId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '3600' });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
