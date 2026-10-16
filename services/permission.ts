import { canAccess, type Permission } from '@/lib/rbac';
import { supabase as browserSupabase } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResult } from '@/types/api';
import type { Organization, OrganizationMembership, Profile } from '@/types/organization';

export type AppSupabaseClient = SupabaseClient;

function normalizeSingleRecord<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export interface OrganizationAccess {
  profile: Profile | null;
  memberships: OrganizationMembership[];
  activeMembership: OrganizationMembership | null;
  activeOrganization: Organization | null;
}

export const PermissionService = {
  async listOrganizationMemberships(client: AppSupabaseClient, profileId: string): Promise<ApiResult<OrganizationMembership[]>> {
    const { data, error } = await client
      .from('organization_members')
      .select('id, organization_id, profile_id, role, created_by, updated_by, created_at, updated_at, deleted_at, deleted_by, organization:organizations(*)')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const memberships = (data ?? [])
      .map((row) => {
        const organization = normalizeSingleRecord(row.organization as Organization | Organization[] | null);

        if (!organization) {
          return null;
        }

        return {
          id: row.id,
          organization_id: row.organization_id,
          profile_id: row.profile_id,
          role: row.role,
          created_by: row.created_by,
          updated_by: row.updated_by,
          created_at: row.created_at,
          updated_at: row.updated_at,
          deleted_at: row.deleted_at,
          deleted_by: row.deleted_by,
          organization,
        } satisfies OrganizationMembership;
      })
      .filter((membership): membership is OrganizationMembership => membership !== null);

    return { data: memberships, error: null };
  },

  getActiveMembership(profile: Profile, memberships: OrganizationMembership[]) {
    return memberships.find((membership) => membership.organization_id === profile.active_organization_id) ?? memberships[0] ?? null;
  },

  getAccessContext(profile: Profile | null, memberships: OrganizationMembership[]): OrganizationAccess {
    const activeMembership = profile ? this.getActiveMembership(profile, memberships) : null;

    return {
      profile,
      memberships,
      activeMembership,
      activeOrganization: activeMembership?.organization ?? null,
    };
  },

  hasPermission(role: Profile['role'] | undefined, permission: Permission) {
    return canAccess(role ?? undefined, permission);
  },
};