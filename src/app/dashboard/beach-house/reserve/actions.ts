"use server";

import { createClient } from "@/lib/supabase/server";
import {
  CLEANING_FEE_CENTS,
  addDays,
  isPrimeFriday,
  rateCentsFor,
  toUtcDate,
  ymd,
} from "@/lib/beach-house";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ReserveState = { error?: string };

export async function createReservationAction(
  _prev: ReserveState,
  formData: FormData,
): Promise<ReserveState> {
  const week = String(formData.get("week") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(week))
    return { error: "Invalid week." };

  const friday = toUtcDate(week);
  if (friday.getUTCDay() !== 5)
    return { error: "Selected date is not a Friday." };
  if (friday.getTime() < toUtcDate(new Date()).getTime())
    return { error: "Cannot book a week in the past." };

  const isPrime = isPrimeFriday(friday);
  const rateCents = rateCentsFor(isPrime);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: member } = await supabase
    .from("members")
    .select("id, is_prime_list")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (!member) return { error: "Member record not found." };
  if (isPrime && !member.is_prime_list)
    return {
      error:
        "Prime weeks are reservable only by members on the prime-time list. Contact the VP Beach House.",
    };

  const { data: existing } = await supabase
    .from("reservations")
    .select("id")
    .eq("week_start_friday", week)
    .in("status", ["requested", "confirmed"])
    .maybeSingle();
  if (existing)
    return { error: "That week already has a request or booking." };

  const { error } = await supabase.from("reservations").insert({
    member_id: member.id,
    week_start_friday: week,
    end_date: ymd(addDays(friday, 7)),
    kind: "rental",
    is_prime: isPrime,
    rate_cents: rateCents,
    cleaning_fee_cents: CLEANING_FEE_CENTS,
    status: "requested",
    notes,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/beach-house/calendar");
  revalidatePath("/dashboard/beach-house/my-reservations");
  redirect("/dashboard/beach-house/my-reservations?just=requested");
}

export async function cancelOwnReservationAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (!member) return;

  await supabase
    .from("reservations")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", id)
    .eq("member_id", member.id)
    .eq("status", "requested");

  revalidatePath("/dashboard/beach-house/my-reservations");
  revalidatePath("/dashboard/beach-house/calendar");
}
