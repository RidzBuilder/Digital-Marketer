export type TentorMode =
  | "affiliate"
  | "personal_brand"
  | "educational"
  | "storytelling"
  | "entertainment"
  | "cinematic"
  | "custom";

export type TentorPackage = {
  mode: TentorMode;
  objective: string;
  hook?: string;
  script?: string;
  storyboard: unknown[];
  masterPrompts: unknown[];
  continuityState: Record<string, unknown>;
  caption?: string;
  cta?: string;
  hashtags?: string[];
  claims: unknown[];
};

export type TentorValidationIssue = {
  code: string;
  message: string;
};

export function validateTentorPackage(input: TentorPackage): TentorValidationIssue[] {
  const issues: TentorValidationIssue[] = [];

  if (!input.objective.trim()) issues.push({ code: "OBJECTIVE_MISSING", message: "Objective is required." });
  if (!Array.isArray(input.storyboard)) issues.push({ code: "STORYBOARD_INVALID", message: "Storyboard must be an array." });
  if (!Array.isArray(input.masterPrompts)) issues.push({ code: "PROMPTS_INVALID", message: "Master prompts must be an array." });
  if (!input.continuityState || typeof input.continuityState !== "object") {
    issues.push({ code: "CONTINUITY_INVALID", message: "Continuity state must be an object." });
  }
  if (!Array.isArray(input.claims)) issues.push({ code: "CLAIMS_INVALID", message: "Claims must be an array." });

  return issues;
}
