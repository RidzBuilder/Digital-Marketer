import { createClient } from "@supabase/supabase-js";

export async function recordUsage(input: {
  workspaceId: string;
  metricCode: string;
  quantity: number;
  source: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("Supabase server secret configuration is required.");

  const supabase = createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await supabase.from("usage_ledger").upsert({
    workspace_id: input.workspaceId,
    metric_code: input.metricCode,
    quantity: input.quantity,
    source: input.source,
    reference_id: input.referenceId ?? null,
    metadata: input.metadata ?? {},
  }, {
    onConflict: "workspace_id,metric_code,reference_id",
    ignoreDuplicates: true,
  });

  if (error) throw new Error("Unable to persist usage entry: " + error.message);
}
