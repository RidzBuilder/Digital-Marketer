"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Email%20and%20password%20are%20required");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=Invalid%20email%20or%20password");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!email || password.length < 8 || !siteUrl) {
    redirect("/login?error=Use%20a%20valid%20email%20and%20configure%20NEXT_PUBLIC_SITE_URL");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: siteUrl + "/auth/callback",
    },
  });

  if (error) {
    const diagnosticCode = String(
      (error as { code?: string }).code
      ?? error.name
      ?? "unknown_auth_error"
    );
    const diagnosticStatus = String(
      (error as { status?: number }).status
      ?? "unknown_status"
    );

    console.error("[auth.signup]", {
      code: diagnosticCode,
      status: diagnosticStatus,
    });

    redirect(
      `/login?error=${encodeURIComponent(
        `Unable to create account [${diagnosticCode}; status=${diagnosticStatus}]`
      )}`
    );
  }

  redirect("/login?message=Check%20your%20email%20to%20confirm%20your%20account");
}
