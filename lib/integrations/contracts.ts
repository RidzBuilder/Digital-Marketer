export type ProviderHealth = {
  provider: string;
  configured: boolean;
};

export type ResearchRequest = {
  url: string;
  workspaceId: string;
};

export type ResearchResult = {
  provider: string;
  url: string;
  title?: string;
  markdown?: string;
  metadata?: Record<string, unknown>;
};

export interface ResearchProvider {
  health(): Promise<ProviderHealth>;
  scrape(request: ResearchRequest): Promise<ResearchResult>;
}

export type MarketingDataRequest = {
  connector: string;
  fields: string[];
  datePreset?: string;
  refreshSince?: string;
  selectAccounts?: string[];
};

export interface MarketingDataProvider {
  health(): Promise<ProviderHealth>;
  query(request: MarketingDataRequest): Promise<unknown>;
}

export type TelemetryEvent = {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
};

export interface TelemetryProvider {
  health(): Promise<ProviderHealth>;
  capture(event: TelemetryEvent): Promise<void>;
}

export type EmailMessage = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  idempotencyKey?: string;
};

export interface EmailProvider {
  health(): Promise<ProviderHealth>;
  send(message: EmailMessage): Promise<{ id?: string }>;
}

export interface BillingProvider {
  health(): Promise<ProviderHealth>;
}
