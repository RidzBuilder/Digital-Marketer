export function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === "23505";
}

export function idempotentRequestMatches(
  existing: { input: unknown; model: string | null },
  request: { prompt: string; model?: string },
): boolean {
  const input = existing.input as { prompt?: string } | null;
  return input?.prompt === request.prompt && (existing.model ?? undefined) === request.model;
}
