import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "./activities";

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS ?? "localhost:7233",
  });

  const worker = await Worker.create({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE ?? "default",
    taskQueue: process.env.TEMPORAL_TASK_QUEUE ?? "digital-marketer",
    workflowsPath: require.resolve("./workflows"),
    activities,
    maxConcurrentActivityTaskExecutions: Number(process.env.TEMPORAL_MAX_ACTIVITY_CONCURRENCY ?? 10),
  });

  await worker.run();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
