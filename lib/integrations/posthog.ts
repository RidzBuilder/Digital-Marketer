import type { ProviderHealth, TelemetryEvent, TelemetryProvider } from "./contracts";

export class PostHogProvider implements TelemetryProvider {
  async health(): Promise<ProviderHealth> {
    return {
      provider: "posthog",
      configured: Boolean(
        process.env.POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
      ),
    };
  }

  async capture(event: TelemetryEvent): Promise<void> {
    const apiKey = process.env.POSTHOG_PROJECT_TOKEN;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!apiKey || !host) throw new Error("PostHog environment is not configured.");

    const response = await fetch(host.replace(//$/, "") + "/i/v0/e/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        distinct_id: event.distinctId,
        event: event.event,
        properties: {
          ...(event.properties ?? {}),
          ...(event.idempotencyKey ? { "$insert_id": event.idempotencyKey } : {}),
        },
      }),
    });

    if (!response.ok) {
      throw new Error("PostHog capture failed with status " + response.status);
    }
  }
}
