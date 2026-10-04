"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function required(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(key + " is required");
  return value;
}

export async function createBusinessAction(formData: FormData) {
  const workspaceId = required(formData, "workspace_id");
  const name = required(formData, "name");

  const supabase = await createClient();
  const { error } = await supabase.from("businesses").insert({
    workspace_id: workspaceId,
    name,
    legal_name: String(formData.get("legal_name") ?? "").trim() || null,
    website_url: String(formData.get("website_url") ?? "").trim() || null,
    industry: String(formData.get("industry") ?? "").trim() || null,
  });

  if (error) redirect("/dashboard?error=Unable%20to%20create%20business");
  revalidatePath("/dashboard");
}

export async function createBrandAction(formData: FormData) {
  const workspaceId = required(formData, "workspace_id");
  const businessId = required(formData, "business_id");
  const name = required(formData, "name");

  const supabase = await createClient();
  const { error } = await supabase.from("brands").insert({
    workspace_id: workspaceId,
    business_id: businessId,
    name,
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    positioning: String(formData.get("positioning") ?? "").trim() || null,
  });

  if (error) redirect("/dashboard?error=Unable%20to%20create%20brand");
  revalidatePath("/dashboard");
}

export async function createProductAction(formData: FormData) {
  const workspaceId = required(formData, "workspace_id");
  const businessId = required(formData, "business_id");
  const name = required(formData, "name");

  const brandId = String(formData.get("brand_id") ?? "").trim() || null;

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    workspace_id: workspaceId,
    business_id: businessId,
    brand_id: brandId,
    name,
    sku: String(formData.get("sku") ?? "").trim() || null,
    product_url: String(formData.get("product_url") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
  });

  if (error) redirect("/dashboard?error=Unable%20to%20create%20product");
  revalidatePath("/dashboard");
}
