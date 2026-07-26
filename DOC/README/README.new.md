# LeadPilot AI

LeadPilot AI is an AI-powered Lead Generation, CRM, Marketing Automation, and Customer Acquisition Platform designed to help local businesses grow, generate leads, and increase revenue.

## Current status

The foundation is now implemented and the product is moving into deeper CRM and automation work.

### Completed

- Established a modular monorepo structure for the web app, admin app, API, and shared product packages.
- Implemented the initial CRM foundation for leads, companies, deals, tasks, notes, and activity tracking.
- Added a dashboard shell, reusable layout widgets, and a working CRM workspace experience.
- Added authentication scaffolding with protected routes and organization-aware app structure.

### Pending

- Full OAuth and social authentication.
- Production-grade database and access-control setup.
- AI reports, marketing automation, analytics dashboards, and assistant workflows.

## Architecture

The product is organized as a modular monorepo so key capabilities can be developed and deployed independently:

- apps/web: customer-facing Next.js application
- apps/admin: internal admin portal
- apps/api: API and edge function entry points
- packages/ui: shared UI components
- packages/crm: CRM domain logic
- packages/data-source-engine: provider-agnostic business discovery and enrichment engine
- packages/marketing: campaigns and messaging workflows
- packages/ai-engine: AI reports and recommendations
- packages/analytics: metrics, dashboards, and reporting
- packages/auth: authentication and access control
- packages/shared: shared utilities and types
- packages/database: schema and persistence helpers

## Lead Discovery vs Data Source Engine

- **Lead Discovery** is the user-facing feature.
- **Data Source Engine** is the internal architecture layer that powers Lead Discovery and future provider integrations.
- The engine normalizes business data from providers such as Google Places, Yelp, Bing Maps, OpenStreetMap, Justdial, IndiaMART, CSV imports, and future sources.

## Features

- **Lead Discovery**: Search and import businesses using the Data Source Engine.
- **CRM**: Manage leads, contacts, companies, deals, and tasks with a user-friendly interface.
- **Marketing Automation**: Automate marketing campaigns across various channels including email, SMS, and social media.
- **Analytics**: Gain insights into KPIs, revenue, and marketing ROI with customizable dashboards.
- **AI Reports**: Generate detailed AI-driven reports to identify opportunities and growth strategies.
- **Customizable Dashboards**: Industry-specific dashboards with tailored KPIs and reports.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase, PostgreSQL
- **Storage**: Supabase Storage
- **Email**: Resend
- **Notifications**: WhatsApp Cloud API, Email, SMS
- **Payments**: Razorpay, Stripe
- **AI**: OpenAI API
- **Charts**: Recharts

## Installation

1. Clone the repository.
2. Install pnpm if needed.
3. Run `pnpm install` from the repository root.
4. Start the web app with `pnpm dev`.

## Usage

Visit `http://localhost:3000` in your browser to access the web application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
