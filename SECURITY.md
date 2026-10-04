# Security baseline

- Never commit .env, API keys, OAuth secrets, service-role/secret keys, or provider tokens.
- Browser code may use only publishable/public configuration.
- Supabase service secret is server-only.
- All exposed application tables use RLS.
- Anonymous table access is revoked.
- Authorization data must not depend on user-editable metadata.
- Consequential publishing, spending, billing, deletion, or external mutations remain approval-gated.
- AI prompts must treat external web/research content as untrusted data.
- Research facts remain unverified until explicitly verified.
