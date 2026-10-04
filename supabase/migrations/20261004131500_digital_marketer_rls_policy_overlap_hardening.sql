-- Split SELECT-overlapping FOR ALL policies into per-action write policies.
-- Preserves existing authorization predicates while removing duplicate SELECT evaluation.

drop policy if exists "workspace_member_write_billing" on public.billing_customers;
create policy "workspace_member_insert_billing" on public.billing_customers
for insert to authenticated
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_update_billing" on public.billing_customers
for update to authenticated
using (private.is_workspace_member(workspace_id))
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_delete_billing" on public.billing_customers
for delete to authenticated
using (private.is_workspace_member(workspace_id));

drop policy if exists "workspace_member_write_subscriptions" on public.subscriptions;
create policy "workspace_member_insert_subscriptions" on public.subscriptions
for insert to authenticated
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_update_subscriptions" on public.subscriptions
for update to authenticated
using (private.is_workspace_member(workspace_id))
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_delete_subscriptions" on public.subscriptions
for delete to authenticated
using (private.is_workspace_member(workspace_id));

drop policy if exists "workspace_member_write_campaigns" on public.campaigns;
create policy "workspace_member_insert_campaigns" on public.campaigns
for insert to authenticated
with check (
  private.is_workspace_member(workspace_id)
  and exists (
    select 1 from public.businesses b
    where b.id = campaigns.business_id
      and b.workspace_id = campaigns.workspace_id
  )
);
create policy "workspace_member_update_campaigns" on public.campaigns
for update to authenticated
using (private.is_workspace_member(workspace_id))
with check (
  private.is_workspace_member(workspace_id)
  and exists (
    select 1 from public.businesses b
    where b.id = campaigns.business_id
      and b.workspace_id = campaigns.workspace_id
  )
);
create policy "workspace_member_delete_campaigns" on public.campaigns
for delete to authenticated
using (private.is_workspace_member(workspace_id));

drop policy if exists "workspace_member_write_content" on public.content_items;
create policy "workspace_member_insert_content" on public.content_items
for insert to authenticated
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_update_content" on public.content_items
for update to authenticated
using (private.is_workspace_member(workspace_id))
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_delete_content" on public.content_items
for delete to authenticated
using (private.is_workspace_member(workspace_id));

drop policy if exists "workspace_member_write_assets" on public.creative_assets;
create policy "workspace_member_insert_assets" on public.creative_assets
for insert to authenticated
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_update_assets" on public.creative_assets
for update to authenticated
using (private.is_workspace_member(workspace_id))
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_delete_assets" on public.creative_assets
for delete to authenticated
using (private.is_workspace_member(workspace_id));

drop policy if exists "workspace_member_write_jobs" on public.creative_jobs;
create policy "workspace_member_insert_jobs" on public.creative_jobs
for insert to authenticated
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_update_jobs" on public.creative_jobs
for update to authenticated
using (private.is_workspace_member(workspace_id))
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_delete_jobs" on public.creative_jobs
for delete to authenticated
using (private.is_workspace_member(workspace_id));

drop policy if exists "workspace_member_write_knowledge" on public.knowledge_documents;
create policy "workspace_member_insert_knowledge" on public.knowledge_documents
for insert to authenticated
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_update_knowledge" on public.knowledge_documents
for update to authenticated
using (private.is_workspace_member(workspace_id))
with check (private.is_workspace_member(workspace_id));
create policy "workspace_member_delete_knowledge" on public.knowledge_documents
for delete to authenticated
using (private.is_workspace_member(workspace_id));
