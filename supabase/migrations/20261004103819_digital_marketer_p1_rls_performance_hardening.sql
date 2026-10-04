create index if not exists idx_ai_runs_initiated_by on public.ai_runs(initiated_by);
create index if not exists idx_audit_events_actor_user on public.audit_events(actor_user_id);

drop policy if exists "workspace_member_read" on public.workspaces;
create policy "workspace_member_read" on public.workspaces
for select to authenticated
using (owner_id = (select auth.uid()) or private.is_workspace_member(id));

drop policy if exists "workspace_owner_create" on public.workspaces;
create policy "workspace_owner_create" on public.workspaces
for insert to authenticated
with check (owner_id = (select auth.uid()));

drop policy if exists "workspace_bootstrap_owner" on public.workspace_members;
create policy "workspace_bootstrap_owner" on public.workspace_members
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and role = 'owner'
  and exists (
    select 1 from public.workspaces w
    where w.id = workspace_members.workspace_id
      and w.owner_id = (select auth.uid())
  )
);

drop policy if exists "workspace_member_create_ai_runs" on public.ai_runs;
create policy "workspace_member_create_ai_runs" on public.ai_runs
for insert to authenticated
with check (
  private.is_workspace_member(workspace_id)
  and (initiated_by is null or initiated_by = (select auth.uid()))
);