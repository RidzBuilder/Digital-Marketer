import { Client, Connection } from "@temporalio/client";
import { marketingWorkflow, type MarketingWorkflowInput } from "./workflows";

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
  const taskQueue = process.env.TEMPORAL_TASK_QUEUE ?? "digital-marketer";

  return client.workflow.start(marketingWorkflow, {
    taskQueue,
    workflowId: "marketing-" + input.runId,
    args: [input],
  });
}
