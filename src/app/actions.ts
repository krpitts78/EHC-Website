"use server";

import { createClient } from "@/lib/supabase/server";

export type InquiryState = { error?: string; success?: boolean };

export async function submitInquiryAction(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot — if filled, silently drop. Bots fill all fields, humans never see this one.
  if (formData.get("website")) return { success: true };

  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const sponsor_name =
    String(formData.get("sponsor_name") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!full_name) return { error: "Name is required." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "A valid email is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("membership_inquiries").insert({
    full_name,
    email,
    phone,
    sponsor_name,
    message,
  });
  if (error) return { error: "Couldn't submit. Try again or email the club directly." };

  return { success: true };
}
