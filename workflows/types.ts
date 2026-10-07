export type MarketingWorkflowInput = {
  runId: string;
  workspaceId: string;
  userId: string;
  prompt: string;
  model?: string;
};

export type MarketingRunOutput = {
  response_id: string;
  text: string;
};
