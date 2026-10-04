create table if not exists public.billing_customers (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null unique references public.workspaces(id) on delete cascade,
  provider text not null default 'stripe',
  provider_customer_id text,
  email text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  provider text not null default 'stripe',
  provider_subscription_id text,
  plan_code text not null default 'free',
  status text not null default 'active' check (status in ('trialing','active','past_due','paused','cancelled','incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id)
);

create table if not exists public.usage_ledger (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  metric_code text not null,
  quantity numeric not null default 1,
  unit text not null default 'unit',
  source text not null,
  reference_id text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default extensions.uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  channel text not null check (channel in ('email','in_app','webhook')),
  provider text,
  event_type text not null,
  recipient text,
  status text not null default 'queued' check (status in ('queued','sent','failed','cancelled')),
  provider_message_id text,
  idempotency_key text,
  payload jsonb not null default '{}'::jsonb,
  error jsonb,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (channel, idempotency_key)
);

create index if not exists idx_billing_workspace on public.billing_customers(workspace_id);
create index if not exists idx_subscriptions_workspace on public.subscriptions(workspace_id, created_at desc);
create index if not exists idx_usage_workspace_time on public.usage_ledger(workspace_id, occurred_at desc);
create index if not exists idx_notifications_workspace on public.notifications(workspace_id, created_at desc);

drop trigger if exists trg_billing_updated_at on public.billing_customers;
create trigger trg_billing_updated_at before update on public.billing_customers for each row execute function public.set_updated_at();

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();

alter table public.billing_customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_ledger enable row level security;
alter table public.notifications enable row level security;

create policy "workspace_member_read_billing" on public.billing_customers for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_write_billing" on public.billing_customers for all to authenticated using (private.is_workspace_member(workspace_id)) with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_read_subscriptions" on public.subscriptions for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_write_subscriptions" on public.subscriptions for all to authenticated using (private.is_workspace_member(workspace_id)) with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_read_usage" on public.usage_ledger for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "workspace_member_insert_usage" on public.usage_ledger for insert to authenticated with check (private.is_workspace_member(workspace_id));
create policy "user_read_notifications" on public.notifications for select to authenticated using (user_id = (select auth.uid()) or (workspace_id is not null and private.is_workspace_member(workspace_id)));
create policy "workspace_member_insert_notifications" on public.notifications for insert to authenticated with check (user_id = (select auth.uid()) or (workspace_id is not null and private.is_workspace_member(workspace_id)));

grant select, insert, update, delete on public.billing_customers, public.subscriptions to authenticated;
grant select, insert on public.usage_ledger, public.notifications to authenticated;