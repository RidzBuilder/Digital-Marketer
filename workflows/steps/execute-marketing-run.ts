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

async function finalizeCompletedRun(
  supabase: ReturnType<typeof getAdminClient>,
  input: MarketingWorkflowInput,
  output: MarketingRunOutput,
  model: string,
  stepId: string,
) {
  await recordUsage({
    workspaceId: input.workspaceId,
    metricCode: "ai.run",
    quantity: 1,
    source: "openai",
    referenceId: input.runId,
    metadata: {
      workflow: "marketingWorkflow",
      workflowEngine: "vercel-workflows",
      model,
      stepId,
      responseId: output.response_id,
    },
  });

  await recordAuditEvent({
    workspaceId: input.workspaceId,
    actorUserId: input.userId,
    action: "ai_run_completed",
    entityType: "ai_run",
    entityId: input.runId,
    requestId: "ai-run:" + input.runId + ":completed",
    metadata: {
      model,
      responseId: output.response_id,
      workflowEngine: "vercel-workflows",
      stepId,
    },
  });
}

async function markCompleted(
  supabase: ReturnType<typeof getAdminClient>,
  input: MarketingWorkflowInput,
  output: MarketingRunOutput,
) {
  const { error } = await supabase.from("ai_runs").update({
    status: "completed",
    output,
    finished_at: new Date().toISOString(),
  }).eq("id", input.runId).eq("workspace_id", input.workspaceId);

  if (error) throw new Error("Unable to persist completed AI run: " + error.message);
}

export async function executeMarketingRun(input: MarketingWorkflowInput): Promise<MarketingRunOutput> {
  "use step";

  const { stepId } = getStepMetadata();
  const supabase = getAdminClient();

  const { data: existing, error: existingError } = await supabase
    .from("ai_runs")
    .select("status,output,model")
    .eq("id", input.runId)
    .eq("workspace_id", input.workspaceId)
    .maybeSingle();

  if (existingError) {
    throw new Error("Unable to load AI run state: " + existingError.message);
  }

  if (existing?.output) {
    const output = existing.output as MarketingRunOutput;
    const model = existing.model ?? input.model ?? "unknown";

    await finalizeCompletedRun(supabase, input, output, model, stepId);

    if (existing.status !== "completed") {
      await markCompleted(supabase, input, output);
    }

    await captureProductEvent({
      distinctId: input.userId,
      event: "ai run completed",
      idempotencyKey: "ai-run:" + input.runId + ":completed",
      properties: {
        workspace_id: input.workspaceId,
        workflow: "marketingWorkflow",
        workflow_engine: "vercel-workflows",
      },
    });

    return output;
  }

  const openai = getOpenAI();
  const model = input.model ?? process.env.OPENAI_MODEL;

  if (!model) throw new Error("OPENAI_MODEL must be configured.");

  const { error: runningError } = await supabase.from("ai_runs").update({
    status: "running",
    started_at: new Date().toISOString(),
    provider: "openai",
    model,
  }).eq("id", input.runId).eq("workspace_id", input.workspaceId);

  if (runningError) {
    throw new Error("Unable to mark AI run as running: " + runningError.message);
  }

  await recordAuditEvent({
    workspaceId: input.workspaceId,
    actorUserId: input.userId,
    action: "ai_run_started",
    entityType: "ai_run",
    entityId: input.runId,
    requestId: "ai-run:" + input.runId + ":started",
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

  const { error: outputError } = await supabase.from("ai_runs").update({
    output,
  }).eq("id", input.runId).eq("workspace_id", input.workspaceId);

  if (outputError) {
    throw new Error("Unable to persist AI run output: " + outputError.message);
  }

  await finalizeCompletedRun(supabase, input, output, model, stepId);
  await markCompleted(supabase, input, output);

  await captureProductEvent({
    distinctId: input.userId,
    event: "ai run completed",
    idempotencyKey: "ai-run:" + input.runId + ":completed",
    properties: {
      workspace_id: input.workspaceId,
      workflow: "marketingWorkflow",
      workflow_engine: "vercel-workflows",
    },
  });

  return output;
}

executeMarketingRun.maxRetries = 3;
