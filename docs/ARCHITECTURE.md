# Digital Marketer Architecture

## Runtime boundaries

ChatGPT Project is the orchestration/control plane. Production execution remains on external infrastructure.

- GitHub: canonical source control
- Vercel: web runtime/deployment
- Supabase: Postgres/Auth/Storage
- Temporal: durable workflows
- OpenAI: model/agent execution
- Firecrawl: research acquisition
- PostHog + Amplitude: analytics
- Resend: transactional email
- Windsor.ai: marketing data aggregation
- Stripe: billing adapter
- Figma/Higgsfield/Canva: design/creative providers
- TENTOR-HOS: reusable content-production engine

## Tenant model

Organization/tenant → workspace → business → brand → product/campaign/content.

Every tenant-owned record has workspace_id. RLS enforces authenticated workspace membership.

## Execution lineage

AI request → ai_runs → Temporal workflow → activity → provider → output → audit_events + usage_ledger + telemetry.

## Research lineage

URL/provider result → knowledge_documents (unverified) → human/AI verification → campaign/content context.

## Creative lineage

ContentItem → creative_job → provider job → creative_asset → QC → publish.

## Provider abstraction

Domain logic depends on interfaces. Providers can be replaced without changing business logic.

## Free-tier-first

Core state is stored in Postgres; vendor services are adapters. External paid features are phase-gated and not required for local/domain development.

## Publication gate

Production publish requires:
1. Vercel ownership/project connection
2. environment variables
3. CI green
4. Supabase security advisor clean
5. E2E smoke checks
6. domain/SSL verification
