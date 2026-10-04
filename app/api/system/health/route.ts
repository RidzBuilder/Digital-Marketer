import { NextResponse } from "next/server";
import { FirecrawlProvider } from "@/lib/integrations/firecrawl";
import { WindsorProvider } from "@/lib/integrations/windsor";
import { PostHogProvider } from "@/lib/integrations/posthog";
import { AmplitudeProvider } from "@/lib/integrations/amplitude";
import { ResendProvider } from "@/lib/integrations/resend";

export const runtime = "nodejs";

export async function GET() {
  const providers = await Promise.all([
    new FirecrawlProvider().health(),
    new WindsorProvider().health(),
    new PostHogProvider().health(),
    new AmplitudeProvider().health(),
    new ResendProvider().health(),
  ]);

  return NextResponse.json({
    ok: true,
    service: "digital-marketer",
    phases: ["P0", "P1", "P2", "P3", "P4", "P5"],
    providers,
    temporalConfigured: Boolean(process.env.TEMPORAL_ADDRESS),
    openAIConfigured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL),
  });
}
