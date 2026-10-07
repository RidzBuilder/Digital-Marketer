import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import { FirecrawlProvider } from "@/lib/integrations/firecrawl";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null) as {
    workspaceId?: string;
    businessId?: string;
    brandId?: string;
    productId?: string;
    url?: string;
  } | null;

  const workspaceId = body?.workspaceId?.trim();
  const sourceUrl = body?.url?.trim();

  if (!workspaceId || !sourceUrl) {
    return NextResponse.json({ error: "workspaceId and url are required" }, { status: 400 });
  }

  const provider = new FirecrawlProvider();
  const health = await provider.health();

  if (!health.configured) {
    return NextResponse.json({ error: "Research provider is not configured" }, { status: 503 });
  }

  const result = await provider.scrape({ workspaceId, url: sourceUrl });

  const { data, error } = await supabase.from("knowledge_documents").insert({
    workspace_id: workspaceId,
    business_id: body?.businessId ?? null,
    brand_id: body?.brandId ?? null,
    product_id: body?.productId ?? null,
    source_url: result.url,
    source_title: result.title ?? null,
    source_type: "web",
    content: result.markdown ?? "",
    provider: result.provider,
    verification_status: "unverified",
    metadata: (result.metadata ?? {}) as Json,
  }).select("id,source_url,source_title,verification_status").single();

  if (error) return NextResponse.json({ error: "Unable to persist research document" }, { status: 400 });

  return NextResponse.json(data, { status: 201 });
}
