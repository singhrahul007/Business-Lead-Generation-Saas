import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getSafeSupabaseConfig() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://demo-leadpilot.supabase.co';
  }
  if (!key || key === 'your_supabase_anon_key') {
    key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fake-anon-key-placeholder';
  }

  return { url, key };
}

export async function createServerSupabaseClient() {
  const { url, key } = getSafeSupabaseConfig();
  const cookieStore = await cookies();
  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<typeof cookieStore.set>[2];
  };

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });
}
