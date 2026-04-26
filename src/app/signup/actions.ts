"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export type SignupState = { error?: string };

export async function signupAction(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (password !== confirmPassword)
    return { error: "Passwords do not match." };

  const supabase = await createClient();

  const { data: eligible, error: rpcError } = await supabase.rpc(
    "is_email_eligible",
    { check_email: email },
  );
  if (rpcError) return { error: "Could not verify membership. Try again." };
  if (!eligible) {
    return {
      error:
        "We couldn't find that email on the membership list, or an account has already been created for it. Contact the board if you think this is wrong.",
    };
  }

  const origin = (await headers()).get("origin") ?? "";
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });
  if (signUpError) return { error: signUpError.message };

  redirect(`/signup/check-email?email=${encodeURIComponent(email)}`);
}
