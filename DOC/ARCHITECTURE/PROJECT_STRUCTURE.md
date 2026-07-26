# LeadPilot AI — Project Structure

This document describes the folder layout, module responsibilities, and architectural conventions used across the LeadPilot AI codebase.

## Top-Level Layout

```
leadpilot-ai/
├── .next/                    # Next.js build output
├── .turbo/                   # Turborepo cache
├── app/                      # Next.js App Router (routes, pages, API handlers)
├── components/               # Shared React components
├── DOC/                      # Project documentation
├── hooks/                    # Custom React hooks
├── lib/                      # Core utilities, validators, Supabase clients, RBAC
├── middleware.ts             # Next.js middleware (auth protection)
├── node_modules/             # Dependencies
├── services/                 # Data access and business logic
├── supabase/                 # Supabase migrations, functions, seeders
├── tests/                    # Jest / Vitest test suites
├── types/                    # Shared TypeScript types
├── eslint.config.mjs         # ESLint configuration
├── jest.config.cjs           # Jest configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
├── pnpm-lock.yaml            # Lock file
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## `app/` — Application Routes

Next.js App Router pages and API route handlers.

```
app/
├── api/                      # API route handlers
│   ├── auth/logout/          # Authentication API
│   ├── crm/                  # CRM REST API
│   └── lead-discovery/       # Data Source Engine / Lead Discovery API
├── crm/                      # CRM workspace UI
├── dashboard/                # Dashboard home
├── leads/                    # Lead Discovery UI
├── login/                    # Login page
├── organizations/            # Organization management
├── signup/                   # Signup page
├── forgot-password/          # Password recovery
├── reset-password/           # Password reset
├── layout.tsx                # Root layout
├── page.tsx                  # Marketing landing page
├── not-found.tsx              # 404 page
└── globals.css               # Global styles
```

### API Route Conventions

Each CRM entity follows a consistent route pattern:

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/crm/{entity}` | `GET`, `POST` | List (paginated, filtered, sorted, searchable) and create |
| `/api/crm/{entity}/{id}` | `GET`, `PATCH`, `DELETE` | Read, update, and delete a single record |
| `/api/crm/{entity}/bulk` | `POST`, `PATCH`, `DELETE` | Bulk create, bulk update, bulk delete |

The Data Source Engine follows a similar convention:

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/lead-discovery/search` | `POST` | Search businesses through configured provider(s) |
| `/api/lead-discovery/businesses` | `POST` | Persist a normalized business into organization scope |
| `/api/lead-discovery/history` | `GET` | Return previous searches for the current organization |
| `/api/lead-discovery/providers/health` | `GET` | Return provider health and availability |

## `components/` — Shared UI Components

```
components/
├── auth/                     # Authentication components
├── crm/                      # CRM-specific components
└── layout/                   # Layout primitives
```

## `lib/` — Core Utilities

Cross-cutting concerns and shared infrastructure.

```
lib/
├── auth/server.ts            # Server-side auth helpers
├── rbac.ts                   # Role-based access control (RBAC)
├── rbac/server.ts            # Server-side RBAC helpers
├── supabase/
│   ├── client.ts             # Browser Supabase client
│   └── server.ts             # Server Supabase client
└── validators/
    ├── auth.ts               # Auth Zod schemas
    └── crm.ts                # CRM Zod schemas
```

## `services/` — Business Logic and Data Access

Services abstract Supabase interactions and enforce business rules.

```
services/
├── auth.ts                   # Authentication service
├── user.ts                   # User/profile service
├── permission.ts             # Permission/organization membership service
├── organization.ts           # Organization service
├── crm.ts                    # Legacy CRM barrel (re-exports)
├── crm/                      # CRM domain services
│   ├── index.ts              # Barrel exports
│   ├── utils.ts              # Organization context helpers
│   ├── api-utils.ts          # Pagination, filtering, sorting helpers
│   ├── lead.ts               # Lead service
│   ├── company.ts            # Company service
│   ├── contact.ts            # Contact service
│   ├── deal.ts               # Deal service
│   ├── task.ts               # Task service
│   ├── note.ts               # Note service
│   └── activity.ts           # Activity service
└── data-source-engine/       # Provider-agnostic lead discovery engine
    ├── index.ts              # Barrel exports
    ├── provider.ts           # Common provider interface
    ├── registry.ts           # Provider resolution and selection
    ├── factory.ts            # Provider factory helpers
    ├── normalizer.ts         # Normalize provider output
    ├── health.ts             # Provider health checks
    ├── cache.ts              # Cache helpers
    └── providers/            # Vendor-specific implementations
        ├── google-places.ts
        ├── yelp.ts
        ├── bing-maps.ts
        ├── openstreetmap.ts
        └── mock.ts
```

## `types/` — Shared TypeScript Types

Centralized domain models and API contracts.

```
types/
├── api.ts                    # Generic API result types
├── auth.ts                   # Auth types
├── crm.ts                    # CRM entity types
├── lead-discovery.ts         # Lead discovery types
├── organization.ts           # Organization/membership types
└── user.ts                   # User/session types
```

## `tests/` — Automated Tests

```
tests/
├── crm.test.ts               # CRM validation tests
├── lead-discovery.test.ts    # Lead discovery tests
└── organization.test.ts      # Organization tests
```

## `supabase/` — Database and Backend

```
supabase/
└── migrations/               # SQL migrations
```

## Architectural Principles

1. **Feature-First Organization**: Domain modules (CRM, auth, organizations, data source engine) own their types, services, validators, and API routes.
2. **Service Layer Pattern**: UI and API routes consume services rather than querying Supabase directly.
3. **Server/Browser Client Separation**: `lib/supabase/server.ts` is used in API routes and server components; `lib/supabase/client.ts` is used in browser components.
4. **RBAC Everywhere**: API routes and protected pages validate permissions using `lib/rbac.ts`.
5. **Validation at the Edge**: Zod schemas validate all incoming API payloads.
6. **Organization Scoping**: CRM and discovery data are scoped to the active organization; routes enforce this automatically.
7. **Consistent API Contracts**: All list endpoints return `{ data: T[], meta: PaginationMeta }`; mutations return the created/updated record or a 204.
8. **Provider Agnostic Engine**: The Data Source Engine normalizes data from multiple providers so the rest of the product never depends on a single vendor.

## Folder Snapshot (Generated)

```
app/
  api/
    auth/logout/route.ts
    crm/
      lib/
        auth.ts
        factory.ts
        query.ts
        response.ts
      leads/route.ts
      leads/[id]/route.ts
      leads/bulk/route.ts
      companies/route.ts
      companies/[id]/route.ts
      companies/bulk/route.ts
      contacts/route.ts
      contacts/[id]/route.ts
      contacts/bulk/route.ts
      deals/route.ts
      deals/[id]/route.ts
      deals/bulk/route.ts
      tasks/route.ts
      tasks/[id]/route.ts
      tasks/bulk/route.ts
      notes/route.ts
      notes/[id]/route.ts
      notes/bulk/route.ts
      activities/route.ts
      activities/[id]/route.ts
      activities/bulk/route.ts
    lead-discovery/
      search/route.ts
      businesses/route.ts
      history/route.ts
      providers/health/route.ts
  crm/
    layout.tsx
    page.tsx
  dashboard/
    layout.tsx
    page.tsx
  leads/
    layout.tsx
    page.tsx
  login/
    layout.tsx
    page.tsx
  organizations/
    layout.tsx
    page.tsx
    members/
      layout.tsx
      page.tsx
    settings/
      layout.tsx
      page.tsx
  signup/
    layout.tsx
    page.tsx
  forgot-password/
    layout.tsx
    page.tsx
  reset-password/
    page.tsx
  layout.tsx
  page.tsx
  not-found.tsx
  globals.css

components/
  auth/
    AuthCard.tsx
    AuthSessionSync.tsx
  crm/
    crm-forms.tsx
  layout/
    activity-list.tsx
    calendar-card.tsx
    chart-card.tsx
    dashboard-shell.tsx
    Footer.tsx
    kpi-card.tsx
    Navbar.tsx
    page-header.tsx
    tasks-panel.tsx
    widget-card.tsx

lib/
  auth/server.ts
  rbac.ts
  rbac/server.ts
  supabase/client.ts
  supabase/server.ts
  validators/auth.ts
  validators/crm.ts

services/
  auth.ts
  crm.ts
  organization.ts
  permission.ts
  user.ts
  crm/
    activity.ts
    api-utils.ts
    company.ts
    contact.ts
    deal.ts
    index.ts
    lead.ts
    note.ts
    task.ts
    utils.ts
  data-source-engine/
    index.ts
    provider.ts
    registry.ts
    factory.ts
    normalizer.ts
    health.ts
    cache.ts
    providers/
      google-places.ts
      yelp.ts
      bing-maps.ts
      openstreetmap.ts
      mock.ts

supabase/
  migrations/

tests/
  crm.test.ts
  lead-discovery.test.ts
  organization.test.ts

types/
  api.ts
  auth.ts
  crm.ts
  lead-discovery.ts
  organization.ts
  user.ts
```
