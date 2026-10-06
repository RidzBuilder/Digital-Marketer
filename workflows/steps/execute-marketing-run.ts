import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { getStepMetadata } from "workflow";
import { recordAuditEvent } from "@/lib/audit";
import { captureProductEvent } from "@/lib/integrations/telemetry";
import { recordUsage } from "@/lib/usage";
import type { MarketingRunOutput, MarketingWorkflowInput } from "../types";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("Workflow step requires Supabase server secret configuration.");
  return createClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } });
}

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Workflow step requires OPENAI_API_KEY.");
  return new OpenAI({ apiKey: key });
}

export async function executeMarketingRun(input: MarketingWorkflowInput): Promise<MarketingRunOutput> {
  "use step";

  const { stepId } = getStepMetadata();
  const supabase = getAdminClient();
  const openai = getOpenAI();
  const model = input.model ?? process.env.OPENAI_MODEL;

  if (!model) throw new Error("OPENAI_MODEL must be configured.");

  const { data: existing } = await supabase
    .from("ai_runs")
    .select("status,output")
    .eq("id", input.runId)
    .eq("workspace_id", input.workspaceId)
    .maybeSingle();

  if (existing?.status === "completed" && existing.output) {
    return existing.output as MarketingRunOutput;
  }

  await supabase.from("ai_runs").update({
    status: "running",
    started_at: new Date().toISOString(),
    provider: "openai",
    model,
  }).eq("id", input.runId).eq("workspace_id", input.workspaceId);

  await recordAuditEvent({
    workspaceId: input.workspaceId,
    actorUserId: input.userId,
    action: "ai_run_started",
    entityType: "ai_run",
    entityId: input.runId,
    metadata: { workflowEngine: "vercel-workflows", stepId },
  });

  const response = await openai.responses.create({
    model,
    input: [
      {
        role: "system",
        content: "You are the Digital Marketer intelligence layer. Produce grounded, auditable marketing analysis. Never invent facts, claims, prices, guarantees, or performance outcomes.",
      },
      {
        role: "user",
        content: input.prompt,
      },
    ],
  });

  const output: MarketingRunOutput = {
    response_id: response.id,
    text: response.output_text,
  };

  await supabase.from("ai_runs").update({
    status: "completed",
    output,
    finished_at: new Date().toISOString(),
  }).eq("id", input.runId).eq("workspace_id", input.workspaceId);

  await recordUsage({
    workspaceId: input.workspaceId,
    metricCode: "ai.run",
    quantity: 1,
    source: "openai",
    referenceId: input.runId,
    metadata: { workflow: "marketingWorkflow", workflowEngine: "vercel-workflows", model, stepId },
  });

  await recordAuditEvent({
    workspaceId: input.workspaceId,
    actorUserId: input.userId,
    action: "ai_run_completed",
    entityType: "ai_run",
    entityId: input.runId,
    metadata: { model, responseId: response.id, workflowEngine: "vercel-workflows", stepId },
  });

  await captureProductEvent({
    distinctId: input.userId,
    event: "ai run completed",
    properties: {
      workspace_id: input.workspaceId,
      workflow: "marketingWorkflow",
      workflow_engine: "vercel-workflows",
    },
  });

  return output;
}

executeMarketingRun.maxRetries = 3;
