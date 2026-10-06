alter table public.audit_events
  add constraint audit_events_workspace_request_unique
  unique (workspace_id, request_id);

alter table public.usage_ledger
  add constraint usage_ledger_workspace_metric_reference_unique
  unique (workspace_id, metric_code, reference_id);
