import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "./activities";

const { executeMarketingRun } = proxyActivities<typeof activities>({
  startToCloseTimeout: "2 minutes",
  retry: {
    initialInterval: "2 seconds",
    backoffCoefficient: 2,
    maximumInterval: "30 seconds",
    maximumAttempts: 4,
  },
});

export type MarketingWorkflowInput = {
  runId: string;
  workspaceId: string;
  userId: string;
  prompt: string;
  model?: string;
};

export async function marketingWorkflow(input: MarketingWorkflowInput) {
  return executeMarketingRun(input);
}
