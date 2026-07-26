# Database Schema

## Overview

LeadPilot AI uses Supabase Postgres with migration-driven schema management under `supabase/migrations`. The current foundation is centered on authentication-linked profiles, multi-tenant organizations, organization memberships and settings, invitation records, and a tenant-scoped CRM schema.

The Data Source Engine adds provider-aware discovery tables for normalized business data, provider health, and search history.

## Migration Inventory

- `007_create_profiles_organizations.sql`
  - Creates `profiles`, `organizations`, `organization_members`, `organization_settings`, `crm_companies`, and `crm_leads`.
- `008_multi_tenant_foundation.sql`
  - Adds `profiles.active_organization_id`, `organizations.description`, membership/settings uniqueness constraints, `organization_invitations`, and supporting indexes.
- `009_rbac_policies.sql`
  - Enables RLS for tenant tables and adds membership and role helper functions plus first-pass policies.
- `010_database_foundation.sql`
  - Adds audit columns, soft-delete support, stricter constraints, filtered indexes, update triggers, active-row-aware RLS, and same-organization profile visibility.
- `011_crm_database_foundation.sql`
  - Completes the CRM schema with contacts, deals, pipelines, pipeline stages, tasks, notes, activity, tags, custom fields, tag assignments, custom field values, and active-row-aware RLS across CRM tables.
- `012_data_source_engine.sql` (planned)
  - Adds provider tables, search history, provider health, and business cache for the Data Source Engine.

## Core Tables

### `profiles`

- Primary key: `id UUID`
- Foreign key: `id -> auth.users(id)`
- Key columns:
  - `email`
  - `full_name`
  - `role`
  - `active_organization_id -> organizations(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> auth.users(id)`

### `organizations`

- Primary key: `id UUID`
- Key columns:
  - `name`
  - `slug`
  - `industry`
  - `website`
  - `phone`
  - `address`
  - `description`
  - `owner_id -> profiles(id)`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `organization_members`

- Primary key: `id UUID`
- Unique constraint: `(organization_id, profile_id)`
- Key columns:
  - `organization_id -> organizations(id)`
  - `profile_id -> profiles(id)`
  - `role` with allowed values `owner`, `admin`, `manager`, `member`, `viewer`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `organization_settings`

- Primary key: `id UUID`
- Unique constraint: `organization_id`
- Key columns:
  - `organization_id -> organizations(id)`
  - `timezone`
  - `currency`
  - `notification_email`
  - `allow_invites`
  - `auto_assign_leads`
  - `default_language`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `organization_invitations`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `email`
  - `role`
  - `status`
  - `accepted_at`
  - `created_at`
  - `updated_at`

## CRM Tables

### `crm_companies`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `name`
  - `website`
  - `industry`
  - `phone`
  - `address`
  - `status`
  - `description`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_leads`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `company_id -> crm_companies(id)`
  - `contact_id -> crm_contacts(id)`
  - `owner_id -> profiles(id)`
  - `full_name`
  - `email`
  - `phone`
  - `company_name`
  - `status`
  - `source`
  - `notes`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### Data Source Engine Tables (planned)

### `data_source_providers`

- Primary key: `id UUID`
- Key columns:
  - `key` (google_places, yelp, bing_maps, osm, justdial, indiamart, csv, mock)
  - `name`
  - `enabled`
  - `config_json`
  - `created_at`
  - `updated_at`

### `provider_health`

- Primary key: `id UUID`
- Key columns:
  - `provider_key`
  - `status`
  - `last_checked_at`
  - `latency_ms`
  - `error_message`
  - `created_at`
  - `updated_at`

### `lead_search_history`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `profile_id -> profiles(id)`
  - `provider_key`
  - `keyword`
  - `industry`
  - `city`
  - `state`
  - `country`
  - `radius`
  - `page`
  - `page_size`
  - `result_count`
  - `created_at`

### `business_cache`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `provider_key`
  - `external_id`
  - `business_name`
  - `category`
  - `address`
  - `phone`
  - `website`
  - `email`
  - `rating`
  - `reviews`
  - `latitude`
  - `longitude`
  - `last_refreshed_at`
  - `created_at`
  - `updated_at`

## Indexes and Constraints

Notable indexes and constraints currently include:

- `organization_members_organization_profile_key`
- `organization_settings_organization_id_key`
- `profiles_active_organization_id_idx`
- `organization_members_profile_id_idx`
- `organization_invitations_organization_id_idx`
- `crm_pipelines_unique_default_per_org`
- filtered active-row indexes for organizations, memberships, settings, profiles, and CRM entity lookups
- planned provider lookups on `(organization_id, provider_key, external_id)` and search history indexes for discovery queries

## Triggers and Helper Functions

### Triggers

- `set_profiles_updated_at`
- `set_organizations_updated_at`
- `set_organization_members_updated_at`
- `set_organization_settings_updated_at`
- `set_crm_companies_updated_at`
- `set_crm_leads_updated_at`
- `set_crm_contacts_updated_at`
- `set_crm_pipelines_updated_at`
- `set_crm_pipeline_stages_updated_at`
- `set_crm_deals_updated_at`
- `set_crm_tasks_updated_at`
- `set_crm_notes_updated_at`
- `set_crm_activity_updated_at`
- `set_crm_tags_updated_at`
- `set_crm_custom_fields_updated_at`
- `set_crm_custom_field_values_updated_at`

All use `public.set_updated_at_timestamp()` to maintain `updated_at` automatically.

### Security Helper Functions

- `public.is_organization_member(target_organization_id UUID)`
- `public.has_organization_role(target_organization_id UUID, allowed_roles TEXT[])`
- `public.shares_organization_with_profile(target_profile_id UUID)`

## Row-Level Security

RLS is enabled for:

- `profiles`
- `organizations`
- `organization_members`
- `organization_settings`
- `organization_invitations`
- `crm_companies`
- `crm_leads`
- `crm_contacts`
- `crm_deals`
- `crm_pipelines`
- `crm_pipeline_stages`
- `crm_tasks`
- `crm_notes`
- `crm_activity`
- `crm_tags`
- `crm_tag_assignments`
- `crm_custom_fields`
- `crm_custom_field_values`
- planned Data Source Engine tables

The policy model enforces:

- users can create and update their own profile rows
- users can read their own profile and same-organization member profiles
- organization rows are tenant-scoped to active members
- organization writes are restricted by role
- membership and settings writes are restricted by role
- CRM read access is tenant-scoped to organization members
- CRM records use audit fields, update triggers, and soft delete columns for lifecycle tracking
- provider configuration and discovery data are restricted to organization-scoped access
- provider, tag, and custom-field configuration writes are restricted to owner, admin, and manager roles
- company, contact, lead, deal, task, note, activity, tag assignment, and custom-field value writes are restricted to owner, admin, manager, and member roles

## Notes

- WI-201 adds the missing CRM schema and RLS coverage through `011_crm_database_foundation.sql`.
- Phase 2 of Sprint 004 will add the Data Source Engine schema and keep all provider data organization-scoped.
