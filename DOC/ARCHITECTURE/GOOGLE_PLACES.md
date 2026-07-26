# Google Places Integration

## Overview

LeadPilot AI uses Google Places as one provider implementation inside the Data Source Engine. Lead Discovery remains the user-facing feature; Google Places is only one of the sources that can feed normalized business data into the platform.

The current repository references search and save workflows in `app/leads/page.tsx`, but the actual imported service module path `@/services/lead-discovery/google-places` is being replaced by the provider-agnostic Data Source Engine layer.

## Current Behavior (Planned)

The lead discovery page is designed to:

- Collect search inputs: keyword, industry, city, state, country, radius
- Execute a search request through the Data Source Engine
- Persist the discovered business data to Supabase
- Show recent search history and search results

## Planned Data Flow

1. User submits a search query.
2. The Data Source Engine selects the configured provider(s).
3. Google Places provider performs the search when selected.
4. Results are normalized into the application business schema.
5. The top match can be saved into the local database.
6. Search history is logged for later review.

## Key Integration Points

### Google Places API

- Use `places` search endpoints to find local businesses.
- Support keyword, category/industry, geographic location, and radius filters.
- Use a server-side API proxy to keep API keys secret.

### Business data model

Key fields to capture from Google Places:

- `business_name`
- `category`
- `address`
- `phone`
- `website`
- `email`
- `latitude`
- `longitude`
- `rating`
- `reviews`
- `opening_hours`
- `social_media_links`
- `place_id`
- `source`
- `updated_at`

### Search history model

Capture search queries and filters for reuse:

- `keyword`
- `industry`
- `city`
- `state`
- `country`
- `radius`
- `provider_key`
- `created_at`

## Deduplication Strategy

Because businesses can appear across searches, the app should deduplicate saved data by a strong identifier such as `place_id` or `website`.

- Before insert, check whether a business with the same `place_id` already exists.
- If the business exists, update the existing record instead of creating a duplicate.
- Store a normalized company record for use in CRM workflows.

## Refresh Strategy

- Implement a refresh or enrichment path to update stale business data periodically.
- Keep a `last_refreshed_at` field on the business record.
- Use background jobs or scheduled re-runs for high-value leads.

## Security and Compliance

- Store Google API keys in environment variables only.
- Never expose private keys client-side.
- Include rate limit handling and graceful failure states.

## Recommended API surface

- `POST /api/lead-discovery/search`
  - Query payload: keyword, industry, city, state, country, radius, page, pageSize.
  - Response: business search results.

- `POST /api/lead-discovery/businesses`
  - Request: normalized business profile.
  - Response: saved business record.

- `GET /api/lead-discovery/history`
  - Response: recent search history.

## Next Steps

- Add the Data Source Engine provider interface and registry.
- Implement `GooglePlacesProvider` inside the provider folder.
- Create a `businesses` table in migrations to match the seed script.
- Implement a server action or API route to persist search history and save businesses.
- Wire the `app/leads` page to the Data Source Engine service instead of calling a provider-specific module path.
