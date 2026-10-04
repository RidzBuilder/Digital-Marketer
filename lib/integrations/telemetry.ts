import { AmplitudeProvider } from "./amplitude";
import { PostHogProvider } from "./posthog";
import type { TelemetryEvent } from "./contracts";

export async function captureProductEvent(event: TelemetryEvent) {
  const providers = [new PostHogProvider(), new AmplitudeProvider()];
  await Promise.all(
    providers.map(async (provider) => {
      try {
        const health = await provider.health();
        if (health.configured) await provider.capture(event);
      } catch {
        // Analytics failures must never block the primary product flow.
      }
    }),
  );
}
