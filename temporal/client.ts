import { Client, Connection } from "@temporalio/client";
import { marketingWorkflow, type MarketingWorkflowInput } from "./workflows";
import { resolveTaskQueue } from "./task-queues";

let clientPromise: Promise<Client> | undefined;

async function getClient() {
  if (!clientPromise) {
    clientPromise = Connection.connect({
      address: process.env.TEMPORAL_ADDRESS ?? "localhost:7233",
    }).then((connection) => new Client({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE ?? "default",
    }));
  }
  return clientPromise;
}

export async function startMarketingWorkflow(input: MarketingWorkflowInput) {
  const client = await getClient();

  return client.workflow.start(marketingWorkflow, {
    taskQueue: resolveTaskQueue(input.workspaceId),
    workflowId: "marketing-" + input.runId,
    args: [input],
  });
}
