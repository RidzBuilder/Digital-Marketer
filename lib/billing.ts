import type { BillingProvider, ProviderHealth } from "@/lib/integrations/contracts";

export class StripeProvider implements BillingProvider {
  async health(): Promise<ProviderHealth> {
    return {
      provider: "stripe",
      configured: Boolean(process.env.STRIPE_SECRET_KEY),
    };
  }
}
