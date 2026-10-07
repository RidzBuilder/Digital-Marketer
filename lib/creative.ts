import type { ProviderHealth } from "@/lib/integrations/contracts";

export type CreativeJobRequest = {
  workspaceId: string;
  contentItemId?: string;
  jobType: "image" | "video" | "audio" | "design" | "edit" | "render";
  input: Record<string, unknown>;
};

export interface CreativeProvider {
  health(): Promise<ProviderHealth>;
  createJob(request: CreativeJobRequest): Promise<{ provider: string; providerJobId?: string; raw?: unknown }>;
}

export class HiggsfieldProvider implements CreativeProvider {
  async health() {
    return { provider: "higgsfield", configured: Boolean(process.env.HIGGSFIELD_API_KEY) };
  }

  async createJob(_request: CreativeJobRequest): Promise<{ provider: string; providerJobId?: string; raw?: unknown }> {
    throw new Error("Higgsfield runtime adapter is pending authenticated provider API configuration.");
  }
}

export class CanvaProvider implements CreativeProvider {
  async health() {
    return { provider: "canva", configured: Boolean(process.env.CANVA_API_KEY) };
  }

  async createJob(_request: CreativeJobRequest): Promise<{ provider: string; providerJobId?: string; raw?: unknown }> {
    throw new Error("Canva runtime adapter is pending authenticated provider API configuration.");
  }
}
