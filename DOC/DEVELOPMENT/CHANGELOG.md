# Changelog

All notable changes to this repository will be documented in this file.

## [Unreleased]

### Added
- Added complete CRM TypeScript models, shared constants, DTOs, and form value types in `types/crm.ts` aligned with `011_crm_database_foundation.sql`.
- Added comprehensive Zod validators for all CRM entities and forms in `lib/validators/crm.ts`.
- Added CRM validation test suite in `tests/crm.test.ts` covering leads, companies, deals, tasks, notes, pipeline stages, custom fields, and tags.
- Added shared `UserService` and `PermissionService` modules to centralize auth-user, profile, membership, and access resolution.
- Added route classification helpers for public vs authenticated application paths.
- Added RBAC tests for public route detection and default authentication enforcement.
- Added documentation refactor for the Data Source Engine architecture while keeping Lead Discovery as the user-facing feature.

### Changed
- Integrated Zod validation and React Hook Form into `components/crm/crm-forms.tsx` for leads, companies, deals, tasks, and notes.
- Updated `services/crm.ts` to use the new CRM DTOs and inject the active organization when creating CRM records from forms.
- Consolidated auth, organization, and permission consumers onto shared service entry points.
- Updated middleware to protect all non-public application routes by default instead of relying only on a fixed protected-prefix list.
- Standardized redirects so unauthenticated users are sent to `/login` and unauthorized tenant users are redirected to `/organizations`.
- Refreshed project status, schema, API, roadmap, sprint, and README documentation to match the current implementation and the Data Source Engine terminology.

### Fixed
- Closed the route protection gap that previously left future authenticated routes dependent on manual prefix registration.
- Removed duplicated Supabase auth/profile/membership lookup paths across hooks and server helpers.
- Resolved CRM form TypeScript errors caused by overly narrow local state types and missing shared form value types.

### Validation
- Editor diagnostics are clean for the WI-202 CRM types and validation changes.
- `pnpm run test` passes with 28 total tests including the new CRM validation suite.
- `pnpm run type-check` no longer reports CRM-related errors; remaining errors are pre-existing issues outside the CRM module.
- `pnpm run lint` remains blocked by a pre-existing `eslint-config-next/core-web-vitals` flat-config incompatibility and requires a dedicated ESLint configuration work item.
