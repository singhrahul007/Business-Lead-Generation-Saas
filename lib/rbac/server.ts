import { redirect } from 'next/navigation';
import { requireAuthenticatedUser } from '@/lib/auth/server';
import { canAccess, type Permission } from '@/lib/rbac';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PermissionService } from '@/services/permission';
import { UserService } from '@/services/user';
import type { OrganizationMembership } from '@/types/organization';

export async function getServerOrganizationAccess() {
  const user = await requireAuthenticatedUser();

  // If in demo mode without live database, return complete access context
  if (user.id.startsWith('usr_')) {
    const role = (user.user_metadata.role || 'owner') as any;
    const demoOrg = {
      id: 'org_demo_001',
      name: 'LeadPilot Global',
      slug: 'leadpilot-global',
      industry: 'Technology',
      website: 'https://leadpilot.ai',
      phone: '+1 555-019-2834',
      address: 'San Francisco, CA',
      description: 'Demo Workspace',
      owner_id: user.id,
      created_by: user.id,
      updated_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      deleted_by: null,
    };
    const demoMembership: OrganizationMembership = {
      id: 'mem_demo_001',
      organization_id: demoOrg.id,
      profile_id: user.id,
      role,
      created_by: user.id,
      updated_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      deleted_by: null,
      organization: demoOrg,
    };
    const demoProfile = {
      id: user.id,
      email: user.email ?? '',
      full_name: user.user_metadata.full_name ?? 'Demo User',
      role,
      active_organization_id: demoOrg.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      deleted_by: null,
    };

    return PermissionService.getAccessContext(demoProfile, [demoMembership]);
  }

  const supabase = await createServerSupabaseClient();
  const { data: profile } = await UserService.ensureCurrentProfile(supabase, user);

  if (!profile) {
    return {
      ...PermissionService.getAccessContext(null, []),
    };
  }

  const { data: memberships } = await PermissionService.listOrganizationMemberships(supabase, profile.id);

  return PermissionService.getAccessContext(profile, memberships ?? []);
}

export async function requireOrganizationPermission(permission: Permission, redirectTo = '/organizations') {
  const access = await getServerOrganizationAccess();

  if (!access.activeMembership || !canAccess(access.activeMembership.role, permission)) {
    redirect(redirectTo as any);
  }

  return access;
}