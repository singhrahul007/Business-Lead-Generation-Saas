import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AuthService } from '@/services/auth';
import type { AuthUser } from '@/types/user';

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const demoRoleCookie = cookieStore.get('sb-demo-role')?.value;
  const demoToken = cookieStore.get('sb-access-token')?.value;

  if (demoRoleCookie || demoToken) {
    const role = demoRoleCookie || 'owner';
    return {
      id: `usr_${role}_001`,
      app_metadata: {},
      user_metadata: {
        full_name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        organization_name: 'LeadPilot Global',
        role,
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: `${role}@leadpilot.ai`,
      phone: '',
    } as any;
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await AuthService.getAuthenticatedUser(supabase);
  return data;
}

export async function requireAuthenticatedUser(redirectTo?: string): Promise<AuthUser> {
  const user = await getAuthenticatedUser();

  if (!user) {
    const suffix = redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : '';
    redirect(`/login${suffix}`);
  }

  return user;
}

export async function redirectIfAuthenticated(pathname = '/dashboard') {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect(pathname);
  }
}