import { NextResponse } from "next/server";
import { start } from "workflow/api";
import { createClient } from "@/lib/supabase/server";
import { idempotentRequestMatches, isUniqueViolation } from "@/lib/ai/idempotency";
import { marketingWorkflow } from "@/workflows/marketing";

export const runtime = "nodejs";

type CreateRunBody = {
  workspaceId?: string;
  prompt?: string;
  model?: string;
  idempotencyKey?: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as CreateRunBody | null;
  const workspaceId = body?.workspaceId?.trim();
  const prompt = body?.prompt?.trim();
  const model = body?.model?.trim() || undefined;
  const rawIdempotencyKey = request.headers.get("Idempotency-Key") ?? body?.idempotencyKey;
  const idempotencyKey = rawIdempotencyKey?.trim();

  if (!workspaceId || !prompt) {
    return NextResponse.json({ error: "workspaceId and prompt are required" }, { status: 400 });
  }

  if (idempotencyKey !== undefined && (!idempotencyKey || idempotencyKey.length > 255)) {
    return NextResponse.json({ error: "Idempotency-Key must contain 1–255 characters" }, { status: 400 });
  }

  const { data: run, error } = await supabase.from("ai_runs").insert({
    workspace_id: workspaceId,
    initiated_by: authData.user.id,
    workflow_name: "marketingWorkflow",
    workflow_version: "2.0.0",
    status: "queued",
    input: { prompt },
    model: model ?? null,
    ...(idempotencyKey ? { idempotency_key: idempotencyKey } : {}),
  }).select("id,workspace_id,status,input,model,metadata").single();

  if (error || !run) {
    if (idempotencyKey && isUniqueViolation(error)) {
      const { data: existing, error: lookupError } = await supabase
        .from("ai_runs")
        .select("id,workspace_id,status,input,model,metadata")
        .eq("workspace_id", workspaceId)
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();

      if (lookupError || !existing) {
        return NextResponse.json({ error: "Unable to resolve idempotent AI run" }, { status: 500 });
      }

      if (!idempotentRequestMatches(existing, { prompt, model })) {
        return NextResponse.json({
          error: "Idempotency-Key was already used with a different request",
          runId: existing.id,
        }, { status: 409 });
      }

      const metadata = existing.metadata as { workflowRunId?: string } | null;
      return NextResponse.json({
        runId: existing.id,
        workflowRunId: metadata?.workflowRunId,
        status: existing.status,
        idempotentReplay: true,
      }, { status: 200 });
    }

    return NextResponse.json({ error: "Unable to create AI run" }, { status: 400 });
  }

  let workflowRun;
  try {
    workflowRun = await start(marketingWorkflow, [{
      runId: run.id,
      workspaceId: run.workspace_id,
      userId: authData.user.id,
      prompt,
      model,
    }]);
  } catch {
    await supabase.from("ai_runs").update({
      status: "failed",
      error: { message: "Unable to start durable marketing workflow" },
      finished_at: new Date().toISOString(),
    }).eq("id", run.id).eq("workspace_id", run.workspace_id);

    return NextResponse.json({
      error: "Durable workflow could not be started",
      runId: run.id,
    }, { status: 503 });
  }

  const { error: correlationError } = await supabase.from("ai_runs").update({
    metadata: { workflowRunId: workflowRun.runId },
  }).eq("id", run.id).eq("workspace_id", run.workspace_id);

  if (correlationError) {
    return NextResponse.json({
      error: "Workflow started but correlation persistence failed",
      runId: run.id,
      workflowRunId: workflowRun.runId,
      status: "queued",
    }, { status: 202 });
  }

  return NextResponse.json({
    runId: run.id,
    workflowRunId: workflowRun.runId,
    status: "queued",
  }, { status: 202 });
}
