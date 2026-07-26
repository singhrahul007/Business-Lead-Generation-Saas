# Sprint 004 — Data Source Engine Foundation

Sprint duration: 2 weeks (adjust per team calendar)

## Sprint Objective

Build the provider-agnostic Data Source Engine that powers the user-facing Lead Discovery feature. This sprint adds provider abstractions, normalized business data, provider health tracking, and the first provider implementations.

## Business Value

- Allows LeadPilot AI to support multiple lead data vendors without rewiring CRM or UI code.
- Creates a reusable discovery platform for Google Places, Yelp, Bing Maps, OpenStreetMap, Justdial, IndiaMART, CSV imports, and future sources.
- Establishes the first end-to-end flow from discovery search to normalized business import.

## Scope

In-scope:
- `data_source_providers`, `provider_health`, `lead_search_history`, and `business_cache` migrations
- Provider-agnostic Data Source Engine service layer
- `IDataSourceProvider` interface, provider registry, provider factory, normalizer, and error handling
- Google Places provider implementation
- Mock provider for offline/local testing
- `POST /api/lead-discovery/search`, `POST /api/lead-discovery/businesses`, `GET /api/lead-discovery/history`, `GET /api/lead-discovery/providers/health`
- Duplicate detection by `provider_key + external_id`, website, and normalized name + address
- Pagination and export support for search results
- UI: lead discovery page wired to server endpoints (search, import, export)
- Tests for provider registry, normalizer, duplicate detection, and import logic
- Documentation updates

Out-of-scope:
- Full Google Business Profile sync
- Mass-import/ETL pipelines
- AI enrichment services
- Marketing automation beyond documentation references

## Success Criteria

- Authenticated org users can run searches and see paginated results
- Search runs server-side and does not expose API keys to the browser
- The Data Source Engine can resolve multiple providers through one interface
- Import operation persists normalized business records scoped to organization
- Duplicate detection prevents duplicate imports
- Export produces valid CSV with key fields
- Unit and integration tests for provider abstraction and import flow
- Documentation updated: API_SPEC.md, DATABASE_SCHEMA.md, FEATURES.md, PROJECT_STATUS.md, CHANGELOG.md, README.md, architecture.md

## Deliverables

- `supabase/migrations` updated with Data Source Engine tables
- `services/data-source-engine/*` provider abstraction and registry
- `services/data-source-engine/providers/*` with Google Places and mock implementations
- API routes under `app/api/lead-discovery/*`
- UI page `app/leads/page.tsx` wired to the new endpoints
- Duplicate detection and import service
- CSV export endpoint or client-side exporter that requests server-side data
- Tests and documentation

## Risks & Mitigations

- Risk: API quota or billing for Google Places. Mitigation: provider abstraction allows mock provider and future vendor swaps.
- Risk: Duplicate detection complexity. Mitigation: implement conservative matching rules and flag possible duplicates for manual review.
- Risk: Data model mismatches with CRM tables. Mitigation: keep imports additive and organization-scoped.

## Implementation Tasks (ordered)

1. Review Sprint 002 outcomes and ensure organization scoping works.
2. Update documentation to describe the Data Source Engine and keep Lead Discovery as the user-facing feature.
3. Add migrations for `data_source_providers`, `provider_health`, `lead_search_history`, and `business_cache`.
4. Implement provider interface and registry in `services/data-source-engine` with `mock` and `google-places` providers.
5. Implement `POST /api/lead-discovery/search` that accepts filters, delegates to provider(s), normalizes results, and returns paginated results.
6. Implement `POST /api/lead-discovery/businesses` to import a selected business and run duplicate detection.
7. Add `GET /api/lead-discovery/history` and `GET /api/lead-discovery/providers/health`.
8. Wire `app/leads/page.tsx` to the server endpoints with loading/error states and pagination.
9. Add duplicate detection utilities and unit tests.
10. Add integration tests for search → import flow using the mock provider.
11. Run lint, typecheck, and build; fix issues.
12. Update documentation and changelog.

## Estimated Effort

- Engineering (2 devs): 2 weeks (depends on provider complexity)
- QA & Documentation: concurrent across sprint

## Notes

- Lead Discovery remains the product-facing feature.
- Data Source Engine is the internal architecture layer that powers Lead Discovery.
- Provider-specific behavior must remain behind the provider interface.
