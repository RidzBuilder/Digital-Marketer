export function resolveTaskQueue(workspaceId: string): string {
  const buckets = Math.max(
    1,
    Number.parseInt(process.env.TEMPORAL_TASK_QUEUE_BUCKETS ?? "1", 10) || 1,
  );

  if (buckets === 1) return process.env.TEMPORAL_TASK_QUEUE ?? "digital-marketer";

  let hash = 0;
  for (const char of workspaceId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return resolveBucketTaskQueue(hash % buckets);
}

export function resolveBucketTaskQueue(bucket: number): string {
  const base = process.env.TEMPORAL_TASK_QUEUE ?? "digital-marketer";
  const buckets = Math.max(
    1,
    Number.parseInt(process.env.TEMPORAL_TASK_QUEUE_BUCKETS ?? "1", 10) || 1,
  );
  return buckets === 1 ? base : base + "-" + Math.max(0, bucket);
}
