# CRM Workflow

## Overview

LeadPilot AI's CRM workflow is designed to manage leads, companies, contacts, deals, tasks, notes, and activity in a single workspace.

The current codebase has a CRM page skeleton in `app/crm/page.tsx` and a set of CRUD service functions in `services/crm.ts`. The UI supports creating leads, companies, deals, tasks, and notes, and displays activity and task summaries.

## CRM Entities

### Lead

The CRM lead entity is represented in `services/crm.ts` as `crm_leads` and is expected to include:
- `id`
- `company_id`
- `user_id` / `owner_id`
- `status`
- `created_at`
- `updated_at`

Current UI form fields include full name, email, company name, and notes.

### Company

The company entity is represented by `crm_companies` and is expected to include:
- `id`
- `name`
- `website`
- `industry`
- `address`
- `created_at`
- `updated_at`

### Contact

Contacts are referenced through `crm_contacts`, but no create/update UI currently exists.

### Deal

Deals are represented by `crm_deals` with fields such as:
- `title`
- `amount`
- `stage`
- `status`
- `created_at`
- `updated_at`

### Task

Tasks are represented by `crm_tasks` with fields such as:
- `title`
- `due_date`
- `priority`
- `status`
- `created_at`
- `updated_at`

### Note

Notes are represented by `crm_notes` and are bound to an entity type and entity ID.

### Activity

Activity timeline entries are represented by `crm_activity`.

## Recommended CRM Workflow

### Lead Capture

1. Capture inbound leads from discovery, forms, or imports.
2. Normalize and assign leads to an organization and owner.
3. Qualify leads with status values such as `new`, `contacted`, `qualified`, `proposal`, `won`, `lost`.

### Company Management

1. Add or sync companies from lead records or business discovery.
2. Store firmographic data, website, and industry.
3. Use companies as account-level records to associate leads, contacts, deals, and activities.

### Deal Management

1. Create deals linked to leads or companies.
2. Track pipeline stage and expected amount.
3. Update deal status as opportunities progress.

### Task and Activity Management

1. Create tasks to follow up on leads, deals, or accounts.
2. Log notes and actions against CRM entities.
3. Use activity timeline entries to surface customer engagement and workflow history.

## Next Implementation Steps

- Define a complete typed schema for CRM entities in `types/crm`.
- Add API routes or server actions that enforce org scoping and permissions.
- Implement contacts CRUD and pipeline stage configuration.
- Migrate the `app/crm` page to reusable query hooks and add loading/error states.
- Add permissions-aware UI controls for team roles.
- Link lead discovery results into CRM lead creation and company onboarding.
