import { createClient } from "@supabase/supabase-js";

export async function recordAuditEvent(input: {
  workspaceId?: string;
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("Supabase server secret configuration is required.");

  const supabase = createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return supabase.from("audit_events").insert({
    workspace_id: input.workspaceId ?? null,
    actor_user_id: input.actorUserId ?? null,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    request_id: input.requestId ?? null,
    metadata: input.metadata ?? {},
  });
}
