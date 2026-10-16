'use client';

import { useCallback, useEffect, useState } from 'react';
import { getOrganizations, getOrganizationSettings } from '@/services/organization';
import type { Organization, OrganizationRole, OrganizationSettings } from '@/types/organization';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>({
    id: 'org_demo_001',
    name: 'LeadPilot Global',
    slug: 'leadpilot-global',
    industry: 'Technology',
    website: 'https://leadpilot.ai',
    phone: '+1 555-019-2834',
    address: 'San Francisco, CA',
    description: 'Demo Workspace',
    owner_id: 'usr_owner_001',
    created_by: 'usr_owner_001',
    updated_by: 'usr_owner_001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    deleted_by: null,
  });
  const [activeMembership, setActiveMembership] = useState<{ role: OrganizationRole } | null>({
    role: 'owner',
  });
  const [settings, setSettings] = useState<OrganizationSettings | null>({
    id: 'settings_demo_001',
    organization_id: 'org_demo_001',
    timezone: 'UTC',
    currency: 'USD',
    notification_email: 'notifications@leadpilot.ai',
    allow_invites: true,
    auto_assign_leads: true,
    default_language: 'en',
    created_by: 'usr_owner_001',
    updated_by: 'usr_owner_001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    deleted_by: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshOrganizations = useCallback(async () => {
    // Read role from cookie if set
    if (typeof window !== 'undefined') {
      const demoCookie = document.cookie.split('; ').find((row) => row.startsWith('sb-demo-role='));
      if (demoCookie) {
        const role = (demoCookie.split('=')[1] || 'owner') as OrganizationRole;
        setActiveMembership({ role });
      }
    }

    const { data, error: organizationsError } = await getOrganizations();

    if (data && data.length > 0) {
      setOrganizations(data);
      setActiveOrganization(data[0]);
      setError(null);

      const { data: settingsData } = await getOrganizationSettings(data[0].id);
      if (settingsData) {
        setSettings(settingsData);
      }
    } else if (organizationsError) {
      // If error occurs, keep the default demo organization active
      setOrganizations([
        {
          id: 'org_demo_001',
          name: 'LeadPilot Global',
          slug: 'leadpilot-global',
          industry: 'Technology',
          website: 'https://leadpilot.ai',
          phone: '+1 555-019-2834',
          address: 'San Francisco, CA',
          description: 'Demo Workspace',
          owner_id: 'usr_owner_001',
          created_by: 'usr_owner_001',
          updated_by: 'usr_owner_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          deleted_by: null,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    void refreshOrganizations();
  }, [refreshOrganizations]);

  return { organizations, activeOrganization, activeMembership, settings, loading, error, refreshOrganizations };
}