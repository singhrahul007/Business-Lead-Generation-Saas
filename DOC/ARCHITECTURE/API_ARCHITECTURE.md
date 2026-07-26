# LeadPilot AI — API Architecture

This document describes the REST API architecture, conventions, and implementation patterns used across LeadPilot AI.

## Design Goals

- **Consistency**: All endpoints follow the same request/response shapes.
- **Security**: Every endpoint authenticates the caller and authorizes the action.
- **Organization Scoping**: CRM and discovery data are isolated by organization.
- **Flexibility**: List endpoints support pagination, filtering, sorting, and search.
- **Efficiency**: Bulk endpoints reduce round-trips for mass operations.
- **Provider Agnosticism**: Lead Discovery APIs call the Data Source Engine, not a single vendor directly.

## Base URL

All API routes are served under `/api` using Next.js App Router route handlers.

```
/api/auth/*                 # Authentication
/api/crm/*                  # CRM resources
/api/lead-discovery/*       # Data Source Engine / Lead Discovery resources
```

## Authentication

API routes create a server-side Supabase client from request cookies using `lib/supabase/server.ts`. The `UserService.getAuthenticatedUser` helper extracts the current user and validates the session.

Unauthenticated requests receive:

```json
{ "error": "Authentication required." }
```

with HTTP status `401`.

## Authorization

RBAC is enforced via `lib/rbac.ts`. CRM and discovery endpoints require module-specific permissions such as:

- Read operations: `crm.read`, `lead_discovery.read`
- Write operations: `crm.write`, `lead_discovery.write`

Insufficient permissions return:

```json
{ "error": "Forbidden." }
```

with HTTP status `403`.

## Organization Context

After authentication, API handlers resolve the user's active organization via shared organization context helpers. All CRM and discovery queries include `organization_id` filters; mutations inject the organization id into payloads.

If no active organization is selected, the API returns:

```json
{ "error": "No active organization selected." }
```

with HTTP status `400`.

## Resource Naming

Resources are plural nouns:

```
/api/crm/leads
/api/crm/companies
/api/crm/contacts
/api/crm/deals
/api/crm/tasks
/api/crm/notes
/api/crm/activities
/api/lead-discovery/search
/api/lead-discovery/businesses
/api/lead-discovery/history
```

## Standard Endpoints

### List Records

```
GET /api/{resource}?page=1&pageSize=25&search=acme&sortBy=created_at&sortDirection=desc&status=new
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `pageSize` | number | Items per page (default: 25, max: 250) |
| `search` | string | Free-text search term |
| `sortBy` | string | Column to sort by |
| `sortDirection` | `asc` \| `desc` | Sort direction |
| `*` | string \| string[] | Any other parameter is treated as an equality filter; comma-separated values become an `IN` filter |

#### Response

```json
{
  "data": [ /* records */ ],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 100,
    "totalPages": 4
  }
}
```

### Create Record

```
POST /api/{resource}
```

#### Request Body

Validated by the entity's Zod create schema. `organization_id` is injected server-side.

#### Response

The created record with HTTP status `201`.

### Get Record

```
GET /api/{resource}/{id}
```

#### Response

The requested record or `404 Not Found` if it does not exist or belongs to another organization.

### Update Record

```
PATCH /api/{resource}/{id}
```

#### Request Body

Validated by the entity's Zod update schema (partial).

#### Response

The updated record or `404 Not Found` if not accessible.

### Delete Record

```
DELETE /api/{resource}/{id}
```

#### Response

`204 No Content` on success; `404 Not Found` if not accessible.

## Bulk Endpoints

Bulk operations are available at `/api/{resource}/bulk`.

### Bulk Create

```
POST /api/{resource}/bulk
```

### Bulk Update

```
PATCH /api/{resource}/bulk
```

### Bulk Delete

```
DELETE /api/{resource}/bulk
```

## Error Responses

All errors use a consistent JSON shape:

```json
{ "error": "Human-readable message" }
```

| Status | Meaning |
|--------|---------|
| `400` | Bad request / validation error |
| `401` | Authentication required |
| `403` | Forbidden |
| `404` | Resource not found |
| `500` | Internal server error / database error |

## Data Source Engine API Patterns

The Data Source Engine should normalize provider behavior behind shared routes and service contracts.

- `POST /api/lead-discovery/search`
- `POST /api/lead-discovery/businesses`
- `GET /api/lead-discovery/history`
- `GET /api/lead-discovery/providers/health`

Provider-specific details must remain inside the engine layer. API callers should only see normalized business results and provider metadata where needed.

## Implementation Layers

```
Route Handler (app/api/*)
        │
        ▼
Entity Route Factory / Engine Service
        │
        ▼
Auth Helpers / Query Parser / Response Helpers
        │
        ▼
Domain Service (services/*)
        │
        ▼
Supabase Client (lib/supabase/server.ts)
```

## Code Patterns

### Adding a New Entity

1. Define the TypeScript type in `types/*`.
2. Add Zod create/update schemas in `lib/validators/*`.
3. Implement the service in `services/*`.
4. Register the service in the relevant barrel file.
5. Create route files.
6. Wire the service and schemas through the route handlers.
7. Add tests and update API documentation.
