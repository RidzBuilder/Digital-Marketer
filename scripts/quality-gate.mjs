import { existsSync, readFileSync } from "node:fs";

const required = [
  "package.json",
  "next.config.ts",
  "proxy.ts",
  "app/page.tsx",
  "app/login/page.tsx",
  "app/dashboard/page.tsx",
  "app/api/health/route.ts",
  "app/api/system/health/route.ts",
  "app/api/ai/runs/route.ts",
  "app/api/research/route.ts",
  "supabase/migrations/20261004103513_digital_marketer_p1_foundation.sql",
  "supabase/migrations/20261004103819_digital_marketer_p1_rls_performance_hardening.sql",
  "supabase/migrations/20261004104209_digital_marketer_p3_marketing_core.sql",
  "supabase/migrations/20261004104302_digital_marketer_p4_saas_operations.sql",
  "supabase/migrations/20261004104309_digital_marketer_p5_creative_core.sql",
  "supabase/migrations/20261004104602_digital_marketer_performance_indexes.sql",
  "temporal/workflows.ts",
  "temporal/activities.ts",
  "temporal/client.ts",
  "temporal/worker.ts",
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error("Missing required files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const envExample = readFileSync(".env.example", "utf8");
const forbiddenSecretPatterns = [
  /sk-[A-Za-z0-9]{20,}/,
  /re_[A-Za-z0-9]{12,}/,
  /whsec_[A-Za-z0-9]{12,}/,
];
if (forbiddenSecretPatterns.some((pattern) => pattern.test(envExample))) {
  console.error("Potential real credential found in .env.example");
  process.exit(1);
}

console.log("Digital Marketer quality gate: static repository invariants passed.");
