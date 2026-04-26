"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function adminMemberId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("members")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  return data?.id ?? null;
}

async function bumpPaths() {
  revalidatePath("/dashboard/admin/reservations");
  revalidatePath("/dashboard/beach-house/calendar");
  revalidatePath("/dashboard/beach-house/my-reservations");
}

export async function approveReservationAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  const adminId = await adminMemberId();
  await supabase
    .from("reservations")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      approved_by: adminId,
    })
    .eq("id", id)
    .eq("status", "requested");
  await bumpPaths();
}

export async function rejectReservationAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim() || null;
  if (!id) return;
  const supabase = await createClient();
  const adminId = await adminMemberId();
  await supabase
    .from("reservations")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      approved_by: adminId,
      notes: reason,
    })
    .eq("id", id)
    .eq("status", "requested");
  await bumpPaths();
}

export async function cancelReservationAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase
    .from("reservations")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", id);
  await bumpPaths();
}

export async function markDepositPaidAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const paid = formData.get("paid") === "true";
  if (!id) return;
  const supabase = await createClient();
  await supabase
    .from("reservations")
    .update({ deposit_paid_at: paid ? new Date().toISOString() : null })
    .eq("id", id);
  await bumpPaths();
}

export async function markBalancePaidAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const paid = formData.get("paid") === "true";
  if (!id) return;
  const supabase = await createClient();
  await supabase
    .from("reservations")
    .update({ balance_paid_at: paid ? new Date().toISOString() : null })
    .eq("id", id);
  await bumpPaths();
}
