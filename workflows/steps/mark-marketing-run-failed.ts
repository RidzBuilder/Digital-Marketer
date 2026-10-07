import { createClient } from "@supabase/supabase-js";
import { recordAuditEvent } from "@/lib/audit";
import type { MarketingWorkflowInput } from "../types";

type FailureInput = MarketingWorkflowInput & { error: { message: string } };

export async function markMarketingRunFailed(input: FailureInput) {
  "use step";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("Workflow failure step requires Supabase server secret configuration.");
  const supabase = createClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await supabase.from("ai_runs").update({ status: "failed", error: input.error, finished_at: new Date().toISOString() }).eq("id", input.runId).eq("workspace_id", input.workspaceId);
  if (error) throw new Error("Unable to persist failed AI run: " + error.message);
  await recordAuditEvent({ workspaceId: input.workspaceId, actorUserId: input.userId, action: "ai_run_failed", entityType: "ai_run", entityId: input.runId, requestId: "ai-run:" + input.runId + ":failed", metadata: { workflowEngine: "vercel-workflows", error: input.error } });
}
markMarketingRunFailed.maxRetries = 3;
