# Digital Marketer

AI Digital Marketing SaaS built as a multi-tenant commercial platform.

## Locked architecture
- Next.js 16.3.8 App Router
- Vercel for web runtime
- Supabase PostgreSQL + Auth + Storage
- Temporal for durable workflows
- OpenAI for intelligence
- Firecrawl for research/data acquisition
- PostHog + Amplitude for product analytics
- Resend for transactional email
- Windsor.ai for marketing data
- Figma for the design system
- TENTOR-HOS as a reusable content-production engine

## Core invariants
1. Multi-tenant boundaries are explicit.
2. RLS is mandatory for application data.
3. Secrets never enter source control or client bundles.
4. Providers are accessed through adapters/interfaces.
5. Durable workflows belong to Temporal.
6. AI executions are traceable and idempotent.
7. Consequential actions remain approval-gated.
8. Unsupported marketing claims are never treated as facts.

## Local development
1. Copy `.env.example` to `.env.local`.
2. Install with pnpm.
3. Run the development server.

The current repository scope is P0/P1 foundation. Temporal workers, billing and external marketing/creative actions are phase-gated modules.
