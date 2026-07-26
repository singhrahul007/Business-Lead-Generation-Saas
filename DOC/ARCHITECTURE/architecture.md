# Architecture

This document describes the current application architecture for LeadPilot AI and the high-level design decisions that guide future development.

## Application Architecture

LeadPilot AI is organized as a Next.js application with a root `app/` directory and supporting shared modules for services, data access, and UI components.

### Core Layers

- `app/`
  - Next.js App Router pages and layouts.
  - Authentication and workspace routes.
- `components/`
  - Reusable UI components for auth, layout, CRM, and dashboard experiences.
- `lib/`
  - Shared utilities, Supabase client initialization, authorization helpers, and validation schemas.
- `services/`
  - Domain-specific service functions that encapsulate Supabase operations and business logic.
- `supabase/`
  - Migration and seed scripts for database schema and initial data.
- `types/`
  - Shared TypeScript type definitions across the app.

## Routing and Guarding

- Public pages: home, login, signup, forgot password, reset password.
- Private pages: dashboard, CRM, leads, organizations, settings, reports.
- Route protection is enforced through middleware and server-side auth checks in protected layouts.

## Data Access

The application uses Supabase for authentication and database access.

- `lib/supabase/client.ts` provides a browser Supabase client.
- `lib/supabase/server.ts` provides a server-side Supabase client for App Router pages and server actions.
- Service modules use these clients to keep database operations centralized.

## Tenant and RBAC Model

The architecture must support multi-tenant organizations with scoped membership and role-based access control:

- Organizations contain users and settings.
- Organization members have roles such as owner, admin, manager, member, and viewer.
- Permissions are defined in a shared RBAC helper and should be enforced across UI and server operations.

## Data Source Engine Architecture

Lead Discovery is the user-facing feature. Internally, it is powered by a provider-agnostic Data Source Engine.

### Responsibilities

- Normalize business data from multiple external providers.
- Register and resolve providers by name or capability.
- Handle provider-specific errors, rate limits, and retries.
- Support multiple data sources without changing CRM or UI code.

### Provider Model

The engine should support providers such as:

- Google Places
- Yelp
- Bing Maps
- OpenStreetMap
- Justdial
- IndiaMART
- CSV import
- Mock provider for offline/local development

### Engine Flow

1. Lead Discovery UI submits search filters.
2. API calls the Data Source Engine.
3. The engine selects the configured provider(s).
4. Provider results are normalized into a shared business model.
5. Duplicate detection and caching are applied.
6. Results are returned to the UI and can be imported into CRM.

## Feature Modules

The codebase is intended to expand into modular feature domains, but the current stable foundation should focus on:

- Authentication
- Organization management
- Core CRM scaffolding
- Data Source Engine and Lead Discovery foundation
- Notification logging and channel dispatch

## Integration Patterns

- Keep third-party provider keys server-side.
- Use schema validation for all form input.
- Prefer server-side session validation for protected pages.
- Avoid client-side Supabase service role usage for sensitive operations.

## Evolution Strategy

Future sprints should continue with the same workflow:

- Business Requirement → Architecture → Database → API → UI → Sprint Plan → Implementation → Testing → Documentation → Git Commit

This ensures work remains predictable, documented, and aligned with product priorities.
