import { supabase as browserSupabase } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResult } from '@/types/api';
import type { Profile } from '@/types/organization';
import { toAuthUser, toUserSession, type AuthUser, type UserSession } from '@/types/user';

export type AppSupabaseClient = SupabaseClient;

function buildProfilePayload(user: AuthUser) {
  return {
    id: user.id,
    email: user.email ?? '',
    full_name: user.user_metadata.full_name ?? null,
    role: (user.user_metadata.role as any) ?? 'member',
  } satisfies Partial<Profile> & Pick<Profile, 'id' | 'email'>;
}

export const UserService = {
  async getAuthenticatedUser(client: AppSupabaseClient = browserSupabase): Promise<ApiResult<AuthUser>> {
    // Check for demo mock user when running without live Supabase
    if (typeof window !== 'undefined') {
      const demoCookie = document.cookie.split('; ').find((row) => row.startsWith('sb-demo-role='));
      if (demoCookie) {
        const role = demoCookie.split('=')[1] || 'owner';
        return {
          data: {
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
          } as any,
          error: null,
        };
      }
    }

    try {
      const { data, error } = await client.auth.getUser();

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data?.user) {
        return { data: null, error: 'Authentication required.' };
      }

      return { data: toAuthUser(data.user), error: null };
    } catch (_err) {
      return { data: null, error: 'Authentication required.' };
    }
  },

  async getCurrentSession(client: AppSupabaseClient = browserSupabase): Promise<UserSession['session']> {
    const { data } = await client.auth.getSession();
    return toUserSession({ user: data.session?.user ?? null, session: data.session })?.session ?? null;
  },

  async ensureCurrentProfile(client: AppSupabaseClient, user: AuthUser): Promise<ApiResult<Profile>> {
    const payload = buildProfilePayload(user);
    const { data, error } = await client.from('profiles').upsert(payload, { onConflict: 'id' }).select('*').single();

    return { data: (data as Profile | null) ?? null, error: error?.message ?? null };
  },

  async getProfileById(client: AppSupabaseClient, profileId: string): Promise<ApiResult<Profile>> {
    const { data, error } = await client.from('profiles').select('*').eq('id', profileId).maybeSingle();
    return { data: (data as Profile | null) ?? null, error: error?.message ?? null };
  },

  async updateActiveOrganization(client: AppSupabaseClient, profileId: string, organizationId: string): Promise<ApiResult<Profile>> {
    const { data, error } = await client
      .from('profiles')
      .update({ active_organization_id: organizationId })
      .eq('id', profileId)
      .select('*')
      .single();

    return { data: (data as Profile | null) ?? null, error: error?.message ?? null };
  },
};