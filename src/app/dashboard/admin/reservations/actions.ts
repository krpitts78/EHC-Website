"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canManageBeachHouse, getCurrentMemberPerm } from "@/lib/permissions";
import { toUtcDate } from "@/lib/beach-house";

export type AdminReservationState = { error?: string };

const VALID_KINDS = new Set(["rental", "block", "event"]);
const VALID_STATUSES = new Set([
  "requested",
  "confirmed",
  "cancelled",
  "completed",
]);

function dollarsToCents(raw: string): number {
  const n = parseFloat(raw);
  if (!isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

type ReservationInput = {
  member_id: string | null;
  kind: string;
  start_date: string;
  end_date: string;
  is_prime: boolean;
  rate_cents: number;
  cleaning_fee_cents: number;
  status: string;
  deposit_paid: boolean;
  balance_paid: boolean;
  notes: string | null;
};

function readForm(formData: FormData): ReservationInput | string {
  const member_id = String(formData.get("member_id") ?? "").trim() || null;
  const kind = String(formData.get("kind") ?? "rental");
  const start_date = String(formData.get("start_date") ?? "");
  const end_date = String(formData.get("end_date") ?? "");
  const is_prime = formData.get("is_prime") === "on";
  const rate_cents = dollarsToCents(String(formData.get("rate_dollars") ?? "0"));
  const cleaning_fee_cents = dollarsToCents(
    String(formData.get("cleaning_fee_dollars") ?? "0"),
  );
  const status = String(formData.get("status") ?? "requested");
  const deposit_paid = formData.get("deposit_paid") === "on";
  const balance_paid = formData.get("balance_paid") === "on";
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!VALID_KINDS.has(kind)) return "Invalid kind.";
  if (!VALID_STATUSES.has(status)) return "Invalid status.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start_date)) return "Invalid start date.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(end_date)) return "Invalid end date.";
  if (toUtcDate(end_date).getTime() <= toUtcDate(start_date).getTime())
    return "End date must be after start date.";
  if (kind === "rental") {
    if (!member_id) return "Rentals require a member.";
    if (toUtcDate(start_date).getUTCDay() !== 5)
      return "Rentals must start on a Friday.";
  }

  return {
    member_id,
    kind,
    start_date,
    end_date,
    is_prime,
    rate_cents,
    cleaning_fee_cents,
    status,
    deposit_paid,
    balance_paid,
    notes,
  };
}

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

export async function createReservationAdminAction(
  _prev: AdminReservationState,
  formData: FormData,
): Promise<AdminReservationState> {
  const perm = await getCurrentMemberPerm();
  if (!canManageBeachHouse(perm)) return { error: "Not authorized." };

  const parsed = readForm(formData);
  if (typeof parsed === "string") return { error: parsed };

  const supabase = await createClient();
  const adminId = await adminMemberId();
  const now = new Date().toISOString();

  const { error } = await supabase.from("reservations").insert({
    member_id: parsed.member_id,
    week_start_friday: parsed.start_date,
    end_date: parsed.end_date,
    kind: parsed.kind,
    is_prime: parsed.is_prime,
    rate_cents: parsed.rate_cents,
    cleaning_fee_cents: parsed.cleaning_fee_cents,
    status: parsed.status,
    confirmed_at: parsed.status === "confirmed" ? now : null,
    cancelled_at: parsed.status === "cancelled" ? now : null,
    approved_by: parsed.status === "confirmed" ? adminId : null,
    deposit_paid_at: parsed.deposit_paid ? now : null,
    balance_paid_at: parsed.balance_paid ? now : null,
    notes: parsed.notes,
  });
  if (error) return { error: error.message };

  await bumpPaths();
  redirect("/dashboard/admin/reservations");
}

export async function updateReservationAdminAction(
  _prev: AdminReservationState,
  formData: FormData,
): Promise<AdminReservationState> {
  const perm = await getCurrentMemberPerm();
  if (!canManageBeachHouse(perm)) return { error: "Not authorized." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing reservation id." };

  const parsed = readForm(formData);
  if (typeof parsed === "string") return { error: parsed };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("reservations")
    .select(
      "status, confirmed_at, cancelled_at, deposit_paid_at, balance_paid_at, approved_by",
    )
    .eq("id", id)
    .maybeSingle();
  if (!existing) return { error: "Reservation not found." };

  const adminId = await adminMemberId();
  const now = new Date().toISOString();

  const update: Record<string, unknown> = {
    member_id: parsed.member_id,
    week_start_friday: parsed.start_date,
    end_date: parsed.end_date,
    kind: parsed.kind,
    is_prime: parsed.is_prime,
    rate_cents: parsed.rate_cents,
    cleaning_fee_cents: parsed.cleaning_fee_cents,
    status: parsed.status,
    notes: parsed.notes,
  };

  if (parsed.status === "confirmed") {
    update.confirmed_at = existing.confirmed_at ?? now;
    update.approved_by = existing.approved_by ?? adminId;
    update.cancelled_at = null;
  } else if (parsed.status === "cancelled") {
    update.cancelled_at = existing.cancelled_at ?? now;
  } else {
    update.confirmed_at = null;
    update.cancelled_at = null;
    update.approved_by = null;
  }

  update.deposit_paid_at = parsed.deposit_paid
    ? (existing.deposit_paid_at ?? now)
    : null;
  update.balance_paid_at = parsed.balance_paid
    ? (existing.balance_paid_at ?? now)
    : null;

  const { error } = await supabase
    .from("reservations")
    .update(update)
    .eq("id", id);
  if (error) return { error: error.message };

  await bumpPaths();
  redirect("/dashboard/admin/reservations");
}
