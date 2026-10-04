import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "./activities";
import { resolveBucketTaskQueue } from "./task-queues";

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS ?? "localhost:7233",
  });

  const buckets = Math.max(
    1,
    Number.parseInt(process.env.TEMPORAL_TASK_QUEUE_BUCKETS ?? "1", 10) || 1,
  );

  const workers = await Promise.all(
    Array.from({ length: buckets }, (_, bucket) =>
      Worker.create({
        connection,
        namespace: process.env.TEMPORAL_NAMESPACE ?? "default",
        taskQueue: resolveBucketTaskQueue(bucket),
        workflowsPath: require.resolve("./workflows"),
        activities,
        maxConcurrentActivityTaskExecutions: Number(process.env.TEMPORAL_MAX_ACTIVITY_CONCURRENCY ?? 10),
      }),
    ),
  );

  await Promise.all(workers.map((worker) => worker.run()));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
