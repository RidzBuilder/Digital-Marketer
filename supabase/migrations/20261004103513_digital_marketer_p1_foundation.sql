create schema if not exists private;

revoke all on function public.rls_auto_enable() from public;
revoke execute on function public.rls_auto_enable() from anon, authenticated;

create table if not exists public.workspaces (
  id uuid primary key default extensions.uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  slug text not null,
  name text not null,
  mode text not null default 'multi_business'
    check (mode in ('multi_business','agency','affiliate')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, slug)
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member'
    check (role in ('owner','admin','member','viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.businesses (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  legal_name text,
  website_url text,
  industry text,
  timezone text not null default 'Asia/Jakarta',
  country_code text not null default 'ID',
  status text not null default 'active'
    check (status in ('active','archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  tagline text,
  positioning text,
  brand_voice jsonb not null default '{}'::jsonb,
  brand_assets jsonb not null default '{}'::jsonb,
  status text not null default 'active'
    check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete set null,
  name text not null,
  sku text,
  description text,
  product_url text,
  claims jsonb not null default '[]'::jsonb,
  attributes jsonb not null default '{}'::jsonb,
  status text not null default 'active'
    check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_runs (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  initiated_by uuid references auth.users(id) on delete set null,
  workflow_name text not null,
  workflow_version text not null default '1.0.0',
  status text not null default 'queued'
    check (status in ('queued','running','waiting','completed','failed','cancelled')),
  idempotency_key text,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  error jsonb,
  provider text,
  model text,
  prompt_version text,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, idempotency_key)
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  workspace_id uuid references public.workspaces(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  request_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_workspace_members_user on public.workspace_members(user_id);
create index if not exists idx_businesses_workspace on public.businesses(workspace_id);
create index if not exists idx_brands_workspace on public.brands(workspace_id);
create index if not exists idx_brands_business on public.brands(business_id);
create index if not exists idx_products_workspace on public.products(workspace_id);
create index if not exists idx_products_business on public.products(business_id);
create index if not exists idx_products_brand on public.products(brand_id);
create index if not exists idx_ai_runs_workspace_created on public.ai_runs(workspace_id, created_at desc);
create index if not exists idx_audit_events_workspace_created on public.audit_events(workspace_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_updated_at() from public;

create or replace function private.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;
revoke all on function private.is_workspace_member(uuid) from public;
grant execute on function private.is_workspace_member(uuid) to authenticated;

create or replace function public.bootstrap_workspace_owner()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  insert into public.workspace_members(workspace_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (workspace_id, user_id) do nothing;
  return new;
end;
$$;
revoke all on function public.bootstrap_workspace_owner() from public;

drop trigger if exists trg_workspaces_updated_at on public.workspaces;
create trigger trg_workspaces_updated_at before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists trg_businesses_updated_at on public.businesses;
create trigger trg_businesses_updated_at before update on public.businesses
for each row execute function public.set_updated_at();

drop trigger if exists trg_brands_updated_at on public.brands;
create trigger trg_brands_updated_at before update on public.brands
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_ai_runs_updated_at on public.ai_runs;
create trigger trg_ai_runs_updated_at before update on public.ai_runs
for each row execute function public.set_updated_at();

drop trigger if exists trg_bootstrap_workspace_owner on public.workspaces;
create trigger trg_bootstrap_workspace_owner after insert on public.workspaces
for each row execute function public.bootstrap_workspace_owner();

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.businesses enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.ai_runs enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "workspace_member_read" on public.workspaces;
drop policy if exists "workspace_owner_create" on public.workspaces;
drop policy if exists "workspace_member_read" on public.workspace_members;
drop policy if exists "workspace_bootstrap_owner" on public.workspace_members;
drop policy if exists "workspace_member_read_businesses" on public.businesses;
drop policy if exists "workspace_member_create_businesses" on public.businesses;
drop policy if exists "workspace_member_update_businesses" on public.businesses;
drop policy if exists "workspace_member_delete_businesses" on public.businesses;
drop policy if exists "workspace_member_read_brands" on public.brands;
drop policy if exists "workspace_member_create_brands" on public.brands;
drop policy if exists "workspace_member_update_brands" on public.brands;
drop policy if exists "workspace_member_delete_brands" on public.brands;
drop policy if exists "workspace_member_read_products" on public.products;
drop policy if exists "workspace_member_create_products" on public.products;
drop policy if exists "workspace_member_update_products" on public.products;
drop policy if exists "workspace_member_delete_products" on public.products;
drop policy if exists "workspace_member_read_ai_runs" on public.ai_runs;
drop policy if exists "workspace_member_create_ai_runs" on public.ai_runs;
drop policy if exists "workspace_member_update_ai_runs" on public.ai_runs;
drop policy if exists "workspace_member_read_audit" on public.audit_events;
drop policy if exists "workspace_member_create_audit" on public.audit_events;

create policy "workspace_member_read" on public.workspaces
for select to authenticated using (owner_id = auth.uid() or private.is_workspace_member(id));

create policy "workspace_owner_create" on public.workspaces
for insert to authenticated with check (owner_id = auth.uid());

create policy "workspace_member_read" on public.workspace_members
for select to authenticated using (private.is_workspace_member(workspace_id));

create policy "workspace_bootstrap_owner" on public.workspace_members
for insert to authenticated
with check (
  user_id = auth.uid() and role = 'owner' and exists (
    select 1 from public.workspaces w where w.id = workspace_members.workspace_id and w.owner_id = auth.uid()
  )
);

create policy "workspace_member_read_businesses" on public.businesses
for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_create_businesses" on public.businesses
for insert to authenticated with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_update_businesses" on public.businesses
for update to authenticated using (private.is_workspace_member(workspace_id))
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_delete_businesses" on public.businesses
for delete to authenticated using (private.is_workspace_member(workspace_id));

create policy "workspace_member_read_brands" on public.brands
for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_create_brands" on public.brands
for insert to authenticated with check (
  private.is_workspace_member(workspace_id) and exists (
    select 1 from public.businesses b where b.id = business_id and b.workspace_id = brands.workspace_id
  )
);
create policy "workspace_member_update_brands" on public.brands
for update to authenticated using (private.is_workspace_member(workspace_id))
with check (
  private.is_workspace_member(workspace_id) and exists (
    select 1 from public.businesses b where b.id = business_id and b.workspace_id = brands.workspace_id
  )
);
create policy "workspace_member_delete_brands" on public.brands
for delete to authenticated using (private.is_workspace_member(workspace_id));

create policy "workspace_member_read_products" on public.products
for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_create_products" on public.products
for insert to authenticated with check (
  private.is_workspace_member(workspace_id)
  and exists (select 1 from public.businesses b where b.id = business_id and b.workspace_id = products.workspace_id)
  and (brand_id is null or exists (
    select 1 from public.brands br where br.id = brand_id and br.workspace_id = products.workspace_id
  ))
);
create policy "workspace_member_update_products" on public.products
for update to authenticated using (private.is_workspace_member(workspace_id))
with check (
  private.is_workspace_member(workspace_id)
  and exists (select 1 from public.businesses b where b.id = business_id and b.workspace_id = products.workspace_id)
  and (brand_id is null or exists (
    select 1 from public.brands br where br.id = brand_id and br.workspace_id = products.workspace_id
  ))
);
create policy "workspace_member_delete_products" on public.products
for delete to authenticated using (private.is_workspace_member(workspace_id));

create policy "workspace_member_read_ai_runs" on public.ai_runs
for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_create_ai_runs" on public.ai_runs
for insert to authenticated with check (
  private.is_workspace_member(workspace_id) and (initiated_by is null or initiated_by = auth.uid())
);
create policy "workspace_member_update_ai_runs" on public.ai_runs
for update to authenticated using (private.is_workspace_member(workspace_id))
with check (private.is_workspace_member(workspace_id));

create policy "workspace_member_read_audit" on public.audit_events
for select to authenticated using (workspace_id is null or private.is_workspace_member(workspace_id));
create policy "workspace_member_create_audit" on public.audit_events
for insert to authenticated with check (workspace_id is null or private.is_workspace_member(workspace_id));

revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to authenticated;
grant select, insert, update, delete on
  public.workspaces,
  public.workspace_members,
  public.businesses,
  public.brands,
  public.products,
  public.ai_runs,
  public.audit_events
to authenticated;
