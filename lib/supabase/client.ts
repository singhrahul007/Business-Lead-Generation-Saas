import { createBrowserClient } from '@supabase/ssr';

function getSafeSupabaseConfig() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // If unset or placeholder/dummy value that is not a valid URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://demo-leadpilot.supabase.co';
  }
  if (!key || key === 'your_supabase_anon_key') {
    key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fake-anon-key-placeholder';
  }

  return { url, key };
}

export function createClient() {
  const { url, key } = getSafeSupabaseConfig();
  return createBrowserClient(url, key);
}

export const supabase = createClient();
