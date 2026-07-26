# Role-Based Access Control (RBAC)

## Current RBAC Model

The codebase currently defines a small role-permission map in `lib/rbac.ts`:

- Roles:
  - `owner`
  - `admin`
  - `manager`
  - `member`
  - `viewer`

- Permissions:
  - `organization.read`
  - `organization.write`
  - `organization.delete`
  - `member.read`
  - `member.write`
  - `member.delete`
  - `invite.create`

### Mapping

```ts
export const rolePermissions: Record<OrganizationRole, string[]> = {
  owner: ['organization.read', 'organization.write', 'organization.delete', 'member.read', 'member.write', 'member.delete', 'invite.create'],
  admin: ['organization.read', 'organization.write', 'member.read', 'member.write', 'invite.create'],
  manager: ['organization.read', 'member.read', 'member.write'],
  member: ['organization.read'],
  viewer: ['organization.read'],
};
```

### Access check

The helper function `canAccess(role, permission)` returns true when a role includes the requested permission.

## Current Limitations

- RBAC is enforced only at the UI/helper layer and is not backed by server-side policies.
- Roles are currently global strings rather than organization-scoped membership roles.
- The code references organization management pages with hard-coded permissions and IDs.
- The repository does not yet use Supabase Row-Level Security policies to enforce RBAC at the database level.
- The role labels in the `types` file (e.g., `Company Owner`, `Marketing Manager`) do not match the `lib/rbac.ts` values.

## Recommended RBAC Architecture

### Role model

Establish a clear organization membership model:

- `owner`
- `admin`
- `manager`
- `member`
- `viewer`

Add higher-level platform roles if needed:

- `super_admin`
- `support`
- `customer`

### Permissions

Use permission names to express capabilities across modules:

- `organization.read`
- `organization.write`
- `organization.delete`
- `member.read`
- `member.write`
- `member.delete`
- `invite.create`
- `crm.lead.read`
- `crm.lead.write`
- `crm.company.read`
- `crm.company.write`
- `crm.deal.read`
- `crm.deal.write`
- `crm.task.read`
- `crm.task.write`
- `lead_discovery.read`
- `lead_discovery.write`
- `data_source_engine.read`
- `data_source_engine.write`
- `marketing.campaign.read`
- `marketing.campaign.write`

### Organization membership table

Create a tenant-scoped membership table:

- `organization_members`
  - `id`
  - `organization_id`
  - `profile_id`
  - `role`
  - `joined_at`
  - `updated_at`

This allows each user to belong to one or more organizations with a distinct role.

### Enforcement layers

1. UI-level permission checks using role helpers.
2. Server-side authorization in API routes and server actions.
3. Supabase RLS policies for tenant isolation and permission enforcement.
4. Audit logs for permission changes and membership actions.

## Example RBAC use cases

- `owner`
  - Manage organizations and organization settings
  - Invite and update organization members
  - Delete the organization
  - Perform all CRM and automation actions

- `admin`
  - Manage organization settings
  - Invite team members
  - Create and update CRM data

- `manager`
  - Read organization data
  - Manage team and CRM items
  - Cannot delete the organization

- `member`
  - Read organization data
  - Access CRM records
  - Cannot manage team members or organization settings

- `viewer`
  - Read-only access to dashboards and CRM reports
  - Cannot mutate data

## Implementation notes

- Keep permission checks centralized in a shared helper module.
- Avoid hard-coding role names or permission checks in page components.
- Use explicit per-resource checks instead of broad role checks when possible.
- Keep data and API responses minimal for unauthorized users.

## Short-term tasks

- Align role names across `types` and RBAC helpers.
- Implement lookup for an authenticated user's current organization membership.
- Replace hard-coded `canAccess('owner', ...)` UI examples with real membership context.
- Add API route authorization and Supabase RLS policies.

## Long-term goals

- Support custom role definitions and permission sets per organization.
- Add audit logging for role changes and invite acceptance.
- Enable feature-level gating for marketing automation, analytics, and AI modules based on roles.
