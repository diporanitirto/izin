import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase credentials not configured.');
  }

  client = createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { 'x-client-info': 'izin-app/1.0.0' } },
  });

  return client;
}
