create table if not exists public.knowledge_documents (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  source_url text,
  source_title text,
  source_type text not null default 'web' check (source_type in ('web','document','manual','provider')),
  content text not null default '',
  content_hash text,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','verified','rejected')),
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  provider text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete set null,
  name text not null,
  objective text,
  status text not null default 'draft' check (status in ('draft','planned','active','paused','completed','archived')),
  channels jsonb not null default '[]'::jsonb,
  audience jsonb not null default '{}'::jsonb,
  strategy jsonb not null default '{}'::jsonb,
  budget jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  business_id uuid references public.businesses(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  context_mode text not null default 'custom' check (context_mode in ('affiliate','personal_brand','educational','storytelling','entertainment','cinematic','custom')),
  title text not null,
  objective text,
  hook text,
  angle text,
  script text,
  storyboard jsonb not null default '[]'::jsonb,
  master_prompts jsonb not null default '[]'::jsonb,
  continuity_state jsonb not null default '{}'::jsonb,
  caption text,
  cta text,
  hashtags jsonb not null default '[]'::jsonb,
  claims jsonb not null default '[]'::jsonb,
  qc_status text not null default 'draft' check (qc_status in ('draft','review','approved','rejected','published')),
  version integer not null default 1,
  lineage jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_knowledge_workspace on public.knowledge_documents(workspace_id, created_at desc);
create index if not exists idx_campaigns_workspace on public.campaigns(workspace_id, created_at desc);
create index if not exists idx_content_workspace on public.content_items(workspace_id, created_at desc);

drop trigger if exists trg_knowledge_updated_at on public.knowledge_documents;
create trigger trg_knowledge_updated_at before update on public.knowledge_documents
for each row execute function public.set_updated_at();

drop trigger if exists trg_campaigns_updated_at on public.campaigns;
create trigger trg_campaigns_updated_at before update on public.campaigns
for each row execute function public.set_updated_at();

drop trigger if exists trg_content_updated_at on public.content_items;
create trigger trg_content_updated_at before update on public.content_items
for each row execute function public.set_updated_at();

alter table public.knowledge_documents enable row level security;
alter table public.campaigns enable row level security;
alter table public.content_items enable row level security;

create policy "workspace_member_read_knowledge" on public.knowledge_documents for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_write_knowledge" on public.knowledge_documents for all to authenticated using (private.is_workspace_member(workspace_id)) with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_read_campaigns" on public.campaigns for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_write_campaigns" on public.campaigns for all to authenticated using (private.is_workspace_member(workspace_id)) with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_read_content" on public.content_items for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_write_content" on public.content_items for all to authenticated using (private.is_workspace_member(workspace_id)) with check (private.is_workspace_member(workspace_id));

grant select, insert, update, delete on public.knowledge_documents, public.campaigns, public.content_items to authenticated;