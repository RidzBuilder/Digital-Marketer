import type { MarketingDataProvider, MarketingDataRequest, ProviderHealth } from "./contracts";

export class WindsorProvider implements MarketingDataProvider {
  async health(): Promise<ProviderHealth> {
    return {
      provider: "windsor.ai",
      configured: Boolean(process.env.WINDSOR_API_KEY),
    };
  }

  async query(request: MarketingDataRequest): Promise<unknown> {
    const apiKey = process.env.WINDSOR_API_KEY;
    if (!apiKey) throw new Error("WINDSOR_API_KEY is not configured.");

    const url = new URL(
      "https://connectors.windsor.ai/" + encodeURIComponent(request.connector),
    );

    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("fields", request.fields.join(","));
    if (request.datePreset) url.searchParams.set("date_preset", request.datePreset);
    if (request.refreshSince) url.searchParams.set("refresh_since", request.refreshSince);
    if (request.selectAccounts?.length) {
      url.searchParams.set("select_accounts", request.selectAccounts.join(","));
    }
    url.searchParams.set("_renderer", "json");

    const response = await fetch(url, {
      headers: { "User-Agent": "Digital-Marketer/1.0" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Windsor query failed with status " + response.status);
    }

    return response.json();
  }
}
