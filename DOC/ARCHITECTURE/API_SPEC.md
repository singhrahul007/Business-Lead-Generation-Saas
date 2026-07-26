# API Specification

## Overview

LeadPilot AI currently exposes a small route-layer API and a larger typed service layer. The production foundation relies on shared services for auth, user/profile, organization context, permissions, CRM access, and the Data Source Engine.

## Route-layer API

### Authentication

#### Logout

- Method: `POST`
- Path: `/api/auth/logout`
- Behavior:
  - invalidates the current Supabase session on the server
  - redirects to `/login` with HTTP 303
- Implementation: `app/api/auth/logout/route.ts`

## Authentication Service Surface

Implemented in `services/auth.ts` and related helpers.

- `signInWithPassword(payload)`
  - signs in an existing user
  - returns typed auth/session result data
- `signUpWithPassword(payload)`
  - creates the auth user
  - bootstraps tenant foundation for the user flow
- `resetPasswordForEmail(email)`
  - sends a password recovery email
- `updatePassword(password)`
  - updates the active authenticated user's password
- `recoverSessionFromUrl()`
  - recovers a session from recovery or email confirmation callback data
- `signOut()`
  - signs the current browser session out
- `getCurrentSession()`
  - returns current session data
- `getAuthenticatedUser(client?)`
  - resolves the current typed auth user from a Supabase client

## User and Permission Service Surface

### `services/user.ts`

- `getAuthenticatedUser(client?)`
- `getCurrentSession(client?)`
- `ensureCurrentProfile(client, user)`
- `getProfileById(client, profileId)`
- `updateActiveOrganization(client, profileId, organizationId)`

### `services/permission.ts`

- `listOrganizationMemberships(client, profileId)`
- `getActiveMembership(profile, memberships)`
- `getAccessContext(profile, memberships)`
- `hasPermission(role, permission)`

## Organization Service Surface

Implemented in `services/organization.ts`.

- `getOrganizationContext()`
- `getOrganizations()`
- `getOrganizationById(id)`
- `createOrganization(payload)`
- `updateOrganization(id, payload)`
- `deleteOrganization(id)`
- `getOrganizationSettings(organizationId)`
- `upsertOrganizationSettings(organizationId, payload)`
- `getOrganizationMembers(organizationId)`
- `inviteOrganizationMember(organizationId, email, role)`
- `updateOrganizationMember(id, role)`
- `deleteOrganizationMember(id)`
- `switchActiveOrganization(organizationId)`

## CRM Service Surface

Implemented in `services/crm.ts`.

- `getLeads()`
- `createLead(payload)`
- `updateLead(id, payload)`
- `getCompanies()`
- `createCompany(payload)`
- `getContacts()`
- `getDeals()`
- `createDeal(payload)`
- `getPipelines()`
- `getTasks()`
- `createTask(payload)`
- `createNote(payload)`
- `getActivityTimeline()`

## Data Source Engine Service Surface

Lead Discovery is user-facing. The engine behind it is provider-agnostic.

### Core service contract

- `searchBusinesses(payload)`
- `saveBusiness(payload)`
- `getSearchHistory()`
- `getProviderHealth()`

### Provider contract

- `searchBusinesses(payload)`
- `getBusinessDetails(externalId)`
- `healthCheck()`
- `normalize(record)`

### Providers

- `GooglePlacesProvider`
- `YelpProvider`
- `BingMapsProvider`
- `OpenStreetMapProvider`
- `MockProvider`

## Route Protection Contract

### Public routes

- `/`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`

### Authenticated routes

All non-public app routes require authentication by default via middleware classification.

Current authenticated areas include:

- `/dashboard`
- `/crm`
- `/leads`
- `/organizations`
- nested organization settings and members routes
- future application routes unless explicitly marked public

### Redirect behavior

- unauthenticated access to authenticated routes redirects to `/login?redirectTo=<pathname>`
- authenticated users visiting auth entry pages are redirected to `/dashboard`
- authenticated users without required tenant permission are redirected to `/organizations`

## Notes

- The Data Source Engine is the internal architecture layer.
- Lead Discovery remains the user-facing feature that uses the engine.
- Provider-specific differences are normalized before data reaches the CRM or UI.
