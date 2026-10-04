create table if not exists public.creative_assets (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  kind text not null check (kind in ('image','video','audio','document','design','other')),
  provider text,
  provider_asset_id text,
  storage_path text,
  source_url text,
  mime_type text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.creative_jobs (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  provider text not null,
  job_type text not null check (job_type in ('image','video','audio','design','edit','render')),
  status text not null default 'queued' check (status in ('queued','running','waiting','completed','failed','cancelled')),
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  provider_job_id text,
  error jsonb,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create index if not exists idx_creative_assets_workspace on public.creative_assets(workspace_id, created_at desc);
create index if not exists idx_creative_jobs_workspace on public.creative_jobs(workspace_id, created_at desc);

alter table public.creative_assets enable row level security;
alter table public.creative_jobs enable row level security;

create policy "workspace_member_read_assets" on public.creative_assets for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_write_assets" on public.creative_assets for all to authenticated using (private.is_workspace_member(workspace_id)) with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_read_jobs" on public.creative_jobs for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_write_jobs" on public.creative_jobs for all to authenticated using (private.is_workspace_member(workspace_id)) with check (private.is_workspace_member(workspace_id));

grant select, insert, update, delete on public.creative_assets, public.creative_jobs to authenticated;