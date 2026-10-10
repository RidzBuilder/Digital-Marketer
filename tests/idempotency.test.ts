import assert from "node:assert/strict";
import test from "node:test";
import { idempotentRequestMatches, isUniqueViolation } from "../lib/ai/idempotency";

test("recognizes only PostgreSQL unique-constraint violations", () => {
  assert.equal(isUniqueViolation({ code: "23505" }), true);
  assert.equal(isUniqueViolation({ code: "PGRST116" }), false);
  assert.equal(isUniqueViolation(null), false);
});

test("replays only when prompt and model match the original request", () => {
  const existing = { input: { prompt: "Create a campaign" }, model: "gpt-4.1-mini" };
  assert.equal(idempotentRequestMatches(existing, { prompt: "Create a campaign", model: "gpt-4.1-mini" }), true);
  assert.equal(idempotentRequestMatches(existing, { prompt: "Different campaign", model: "gpt-4.1-mini" }), false);
  assert.equal(idempotentRequestMatches(existing, { prompt: "Create a campaign", model: "gpt-4.1" }), false);
  assert.equal(idempotentRequestMatches(existing, { prompt: "Create a campaign" }), false);
});
