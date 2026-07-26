# Product Requirements

## Feature: Lead Discovery

### Actor

- Marketing Manager

### Goal

- Find businesses in Delhi

### Workflow

1. Business Requirement
   - Capture the Marketing Manager's need to discover local businesses in Delhi for outreach.
2. Architecture
   - Define the solution architecture for Lead Discovery using the Data Source Engine.
3. Database
   - Model business and search history data in the database.
4. API
   - Define search and save endpoints for the lead discovery workflow.
5. UI
   - Build a search interface, result list, and import/export controls.
6. Sprint Plan
   - Plan implementation steps with acceptance criteria.
7. Implementation
   - Build the feature, using existing services and shared UI patterns.
8. Testing
   - Validate search, import, pagination, duplicate handling, and permissions.
9. Documentation
   - Document the lead discovery feature, including API and usage notes.
10. Git Commit
   - Commit with a clear message and update changelog.

## Acceptance Criteria

### Search

- Marketing Manager can submit a search query for businesses in Delhi.
- The search form accepts industry, keyword, radius, city, state, and country.
- The search result list displays business name, category, address, rating, and contact details.

### Industry

- The search form allows selecting or entering a business industry.
- Industry filter is included in the search request.

### Radius

- The search form allows specifying a radius value.
- Search results are scoped to the selected radius around Delhi.

### Keyword

- The search form allows entering a keyword for business discovery.
- The keyword filter is included in the API request.

### Import

- The user can import discovered businesses into the local system.
- Imported businesses are persisted to the database.

### Duplicate Detection

- The system detects duplicate businesses by a unique identifier such as `place_id` or business name + address.
- Duplicate imports are prevented or merged gracefully.

### Pagination

- Search results support pagination.
- The user can navigate through pages of results.

### Export

- The user can export discovered business results to a CSV or JSON file.
- Export includes key fields such as business name, category, address, phone, website, and rating.

### Permission

- Only authenticated users can access lead discovery.
- Only organization members may search and import leads for their organization.

### Organization Isolation

- Each organization sees only its own discovered businesses.
- Searches and imported records are scoped to the current organization.

## Detailed Requirements

### Business Requirement

Marketing Managers need a fast way to find local businesses in Delhi, filter them by industry and keyword, and bring them into the CRM for outreach. The feature must fit into the multi-tenant architecture and preserve organization data boundaries.

### Architecture

- Use a server-side Data Source Engine service to hide API keys and enforce tenant scope.
- Keep search input and result UI in the root app.
- Use shared authentication and organization context to determine the current tenant.

### Database

- Add provider-aware tables to store normalized businesses and search history.
- Include organization scoping fields such as `organization_id`.

### API

- `POST /api/lead-discovery/search`
- `POST /api/lead-discovery/businesses`
- `GET /api/lead-discovery/history`

### UI

- Lead discovery page with a search form and result grid.
- Controls for provider, industry, keyword, city/state/country, radius.
- Result cards with import actions.
- Pagination controls and export button.

### Sprint Plan

- Define types and validation for lead search.
- Implement backend service for provider-agnostic search and persistence.
- Build frontend search page using existing dashboard shell and forms.
- Add duplicate detection and import safeguards.
- Add export support for results.

### Testing

- Unit tests for validation and duplicate detection.
- Integration tests for search request and import flow.
- End-to-end tests covering authenticated access and org isolation.

### Documentation

- Update `README.md` with lead discovery and Data Source Engine feature notes.
- Document API endpoints in `API_SPEC.md`.
- Capture behavior in `PRODUCT_REQUIREMENTS.md`.

## Notes

This product requirement focuses solely on the lead discovery feature within the scope of the current stabilization and early feature foundation. It is intentionally scoped to preserve tenant isolation, authentication, and core functionality without expanding into AI or marketing automation.
