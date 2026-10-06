import { NextResponse } from "next/server";
import { start } from "workflow/api";
import { createClient } from "@/lib/supabase/server";
import { marketingWorkflow } from "@/workflows/marketing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as {
    workspaceId?: string;
    prompt?: string;
    model?: string;
  } | null;

  const workspaceId = body?.workspaceId?.trim();
  const prompt = body?.prompt?.trim();

  if (!workspaceId || !prompt) {
    return NextResponse.json({ error: "workspaceId and prompt are required" }, { status: 400 });
  }

  const { data: run, error } = await supabase.from("ai_runs").insert({
    workspace_id: workspaceId,
    initiated_by: authData.user.id,
    workflow_name: "marketingWorkflow",
    workflow_version: "2.0.0",
    status: "queued",
    input: { prompt },
    model: body?.model ?? null,
  }).select("id,workspace_id,status").single();

  if (error || !run) {
    return NextResponse.json({ error: "Unable to create AI run" }, { status: 400 });
  }

  try {
    const workflowRun = await start(marketingWorkflow, [{
      runId: run.id,
      workspaceId: run.workspace_id,
      userId: authData.user.id,
      prompt,
      model: body?.model,
    }]);

    return NextResponse.json({
      runId: run.id,
      workflowRunId: workflowRun.runId,
      status: "queued",
    }, { status: 202 });
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
}
