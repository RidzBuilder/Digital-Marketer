import type { ProviderHealth, TelemetryEvent, TelemetryProvider } from "./contracts";

export class AmplitudeProvider implements TelemetryProvider {
  async health(): Promise<ProviderHealth> {
    return {
      provider: "amplitude",
      configured: Boolean(process.env.AMPLITUDE_API_KEY),
    };
  }

  async capture(event: TelemetryEvent): Promise<void> {
    const apiKey = process.env.AMPLITUDE_API_KEY;
    if (!apiKey) throw new Error("AMPLITUDE_API_KEY is not configured.");

    const response = await fetch(
      process.env.AMPLITUDE_API_URL ?? "https://api2.amplitude.com/2/httpapi",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          api_key: apiKey,
          events: [{
            user_id: event.distinctId,
            event_type: event.event,
            ...(event.idempotencyKey ? { insert_id: event.idempotencyKey } : {}),
            event_properties: event.properties ?? {},
          }],
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Amplitude capture failed with status " + response.status);
    }
  }
}
