import type { MarketingRunOutput, MarketingWorkflowInput } from "./types";
import { executeMarketingRun } from "./steps/execute-marketing-run";
import { markMarketingRunFailed } from "./steps/mark-marketing-run-failed";

export async function marketingWorkflow(input: MarketingWorkflowInput): Promise<MarketingRunOutput> {
  "use workflow";

  try {
    return await executeMarketingRun(input);
  } catch (error) {
    await markMarketingRunFailed({
      ...input,
      error: error instanceof Error ? { message: error.message } : { message: "Unknown workflow failure" },
    });
    throw error;
  }
}
