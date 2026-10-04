import type { ProviderHealth, ResearchProvider, ResearchRequest, ResearchResult } from "./contracts";

export class FirecrawlProvider implements ResearchProvider {
  async health(): Promise<ProviderHealth> {
    return {
      provider: "firecrawl",
      configured: Boolean(process.env.FIRECRAWL_API_KEY),
    };
  }

  async scrape(request: ResearchRequest): Promise<ResearchResult> {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    const endpoint = process.env.FIRECRAWL_SCRAPE_URL ?? "https://api.firecrawl.dev/v2/scrape";
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not configured.");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        url: request.url,
        formats: ["markdown"],
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error("Firecrawl scrape failed with status " + response.status);
    }

    const payload = (data && typeof data === "object" && "data" in data)
      ? (data as { data?: Record<string, unknown> }).data ?? {}
      : data as Record<string, unknown>;

    return {
      provider: "firecrawl",
      url: request.url,
      title: typeof payload.title === "string" ? payload.title : undefined,
      markdown: typeof payload.markdown === "string" ? payload.markdown : undefined,
      metadata: typeof payload.metadata === "object" && payload.metadata
        ? payload.metadata as Record<string, unknown>
        : undefined,
    };
  }
}
