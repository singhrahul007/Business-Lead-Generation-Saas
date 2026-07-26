# Deployment

## Overview

LeadPilot AI is designed to deploy on Vercel with Supabase as the backend platform.

## Environments

- Local development
- Preview deployments
- Production

## Core Deployment Requirements

- Store secrets only in environment variables.
- Use Supabase project keys appropriate for each environment.
- Keep server-only secrets out of the browser.
- Use production database migrations before release.

## Recommended Flow

1. Merge sprint branch into main.
2. Run lint, typecheck, and build.
3. Apply database migrations.
4. Deploy frontend to Vercel.
5. Verify auth, org, and route protection.
6. Smoke test lead discovery and CRM flows.

## Notes

Deployment documentation should stay aligned with Supabase, Vercel, and GitHub Actions configuration.
