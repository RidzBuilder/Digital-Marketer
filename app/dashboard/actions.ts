"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
}

export async function createWorkspaceAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const mode = String(formData.get("mode") ?? "multi_business");

  if (!name) redirect("/dashboard?error=Workspace%20name%20is%20required");

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) redirect("/login");

  const slug = slugify(name) || "workspace";
  const { error } = await supabase.from("workspaces").insert({
    name,
    slug,
    mode,
    owner_id: authData.user.id,
  });

  if (error) redirect("/dashboard?error=Unable%20to%20create%20workspace");

  revalidatePath("/dashboard");
}