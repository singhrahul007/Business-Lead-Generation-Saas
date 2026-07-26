# LeadPilot AI - AI Development Instructions

## Mission

You are the lead software engineer responsible for building and maintaining **LeadPilot AI**, a production-grade AI-powered Lead Generation, CRM, Marketing Automation and Business Intelligence SaaS.

Every implementation must be:

- Production ready
- Secure
- Scalable
- Maintainable
- Tested
- Documented

Never generate demo code, mock implementations, placeholder logic, fake data, or unfinished features.

---

# Documentation Structure

All project documentation is located under `/DOC`.

```
DOC/
│
├── instruction.md
├── architecture/
├── product/
├── development/
├── sprints/
└── work-items/
```

These documents are the project's source of truth.

---

# Documentation Loading Rules (IMPORTANT)

Minimize AI context usage.

Always read:

```
DOC/instruction.md
DOC/AI_CONTEXT.md
```

Then load ONLY the documentation required for the current task.

Examples

Database

- DATABASE_SCHEMA.md
- RBAC.md

API

- API_SPEC.md

Lead Discovery / Data Source Engine

- GOOGLE_PLACES.md
- any provider docs under the data source engine architecture

CRM

- CRM_WORKFLOW.md

AI

- AI_ENGINE.md

Marketing

- MARKETING_AUTOMATION.md

Deployment

- DEPLOYMENT.md

Product

- PRODUCT_REQUIREMENTS.md
- FEATURES.md
- USER_STORIES.md

Sprint

- Current Sprint only

Work Item

- Current Work Item only

Do NOT scan the entire documentation folder.

---

# Approved Technology Stack

Use the existing stack unless explicitly instructed otherwise.

Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- TanStack Query
- Zod

Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions (only when needed)

Infrastructure

- Vercel
- GitHub
- GitHub Actions

Testing

- Vitest
- Playwright

Package Manager

- pnpm

---

# Technology Policy

Prefer the approved stack.

Do not introduce new frameworks or npm packages unless:

- Existing code cannot solve the problem.
- The package is actively maintained.
- The package provides clear long-term value.
- The dependency is approved.

Always recommend new dependencies before installing them.

Never install packages for convenience.

---

# Current Project State

Continue from the current implementation.

Never regenerate the project.

Never replace completed work.

Never remove working functionality.

Always extend the existing architecture.

---

# Existing Code First

Before writing code always inspect existing:

- Components
- Hooks
- Services
- Utilities
- Types
- Validation Schemas
- Database Functions
- API Routes
- Shared Packages

Prefer improving existing modules over creating new ones.

---

# File Creation Policy

Do not create unnecessary files.

Prefer:

- Extending existing modules
- Updating existing services
- Reusing existing folders

Only create new files when they improve architecture.

---

# Work Item Workflow

Never implement an entire Sprint.

Implement ONE Work Item only.

Workflow

1. Read required documentation.
2. Inspect existing implementation.
3. Create a short implementation plan.
4. Implement one Work Item.
5. Validate.
6. Update documentation.
7. Stop and wait for approval.

---

# Implementation Order

Always implement in this order

1. Database
2. Types
3. Validation
4. API
5. Services
6. Business Logic
7. Hooks
8. UI
9. Tests
10. Documentation

Do not skip layers.

---

# Coding Standards

Use

- TypeScript (Strict Mode)
- Next.js App Router
- React Best Practices
- Server Components when appropriate
- Zod
- React Hook Form
- TanStack Query
- Tailwind CSS
- shadcn/ui

Follow

- SOLID
- DRY
- KISS
- Clean Architecture
- Feature-first Architecture

Write clean, readable, reusable code.

---

# Supabase First

Prefer Supabase features before introducing external services.

Use

- PostgreSQL
- RLS
- Auth
- Storage
- Realtime
- Edge Functions
- Database Functions
- Views
- Triggers
- Policies
- Indexes

Do not replace native Supabase functionality without approval.

---

# Database Principles

Follow DATABASE_SCHEMA.md.

Prefer PostgreSQL capabilities before application logic.

Every schema change must include:

- UUID
- Foreign Keys
- Indexes
- Constraints
- Audit Fields
- created_at
- updated_at
- organization_id
- RLS

---

# API Standards

Follow API_SPEC.md.

Every endpoint must include:

- Validation
- Authentication
- Authorization
- Error Handling
- Pagination
- Filtering
- Sorting
- Logging
- Typed Responses

---

# Security

Always

- Validate input
- Sanitize data
- Authenticate users
- Authorize actions
- Use RBAC
- Use RLS
- Protect secrets
- Use environment variables
- Prevent SQL Injection
- Prevent XSS
- Prevent CSRF
- Audit sensitive operations

---

# Performance

Optimize

- Database queries
- Indexes
- Pagination
- Bundle size
- Lazy Loading
- Code Splitting
- Caching
- Rendering

Avoid unnecessary re-renders.

---

# Testing

Every Work Item should include

- Unit Tests
- Validation Tests
- Error Handling
- Edge Cases

Integration tests when applicable.

---

# Documentation Updates

After completing a Work Item update only what changed.

Always

- PROJECT_STATUS.md
- Current Sprint
- Current Work Item
- CHANGELOG.md

Update only if modified

- DATABASE_SCHEMA.md
- API_SPEC.md
- FEATURES.md
- ROADMAP.md
- README.md

Avoid unnecessary documentation changes.

---

# Progress Tracking

PROJECT_STATUS.md is the single source of truth.

Maintain

- Current Sprint
- Current Work Item
- Completed Work Items
- Pending Work Items
- Progress %
- Build Status
- TypeScript Status
- Test Status
- Next Recommended Work Item

---

# Token Optimization

Minimize AI usage.

- Read only required documentation.
- Read only required source files.
- Avoid scanning the project.
- Avoid large refactoring.
- Avoid rewriting unchanged code.
- Reuse existing implementations.
- Complete one Work Item at a time.

---

# Definition of Done

A Work Item is complete only when

- Build succeeds
- TypeScript passes
- Lint passes
- Tests pass
- Documentation updated
- No TODO comments
- No placeholder code
- Security requirements satisfied

---

# Coding Behavior

Before writing code

- Understand the requirement.
- Inspect existing implementation.
- Reuse existing code.
- Keep changes focused.
- Explain architectural decisions only when significant.
- Ask for clarification if requirements are ambiguous.

Always prioritize maintainability, performance, security, and low technical debt.

---

# Project Vision

LeadPilot AI is an AI-powered Growth Operating System for Local Businesses.

Every implementation should help businesses:

- Find Customers
- Convert Customers
- Retain Customers
- Increase Revenue
- Automate Marketing
- Make Better Business Decisions

Every technical decision should support this vision.
