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
  const today = toUtcDate(new Date());
  if (friday.getTime() < today.getTime())
    return { error: "Cannot book a week in the past." };
  const oneYearOut = addDays(today, 365);
  if (friday.getTime() > oneYearOut.getTime())
    return {
      error:
        "Reservations open one year before the start date. This week is too far out.",
    };

  // 6 AM Houston-time gate on the exact opening day. The opening moment is
  // 6:00 AM Central on the date exactly 365 days before the Friday.
  if (friday.getTime() === oneYearOut.getTime()) {
    const houstonHour = parseInt(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        hour: "numeric",
        hour12: false,
      }).format(new Date()),
      10,
    );
    if (houstonHour < 6) {
      return {
        error:
          "Reservations for this week open at 6:00 AM Central. Try again then.",
      };
    }
  }

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

  // Pending-request limit: only one outstanding pending request per member.
  const { data: pending } = await supabase
    .from("reservations")
    .select("id")
    .eq("member_id", member.id)
    .eq("kind", "rental")
    .eq("status", "requested")
    .limit(1);
  if (pending && pending.length > 0)
    return {
      error:
        "You already have a pending reservation request. Wait for it to be approved or cancel it before requesting another.",
    };

  const { data: existing } = await supabase
    .from("reservations")
    .select("id")
    .eq("week_start_friday", week)
    .in("status", ["requested", "confirmed"])
    .maybeSingle();
  if (existing)
    return { error: "That week already has a request or booking." };

  // Per-year limit per the rules:
  //   Prime-list members: 1 prime + 1 non-prime per calendar year.
  //   Non-prime-list members: 1 non-prime per calendar year.
  const year = friday.getUTCFullYear();
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;
  const { data: ownYear } = await supabase
    .from("reservations")
    .select("is_prime")
    .eq("member_id", member.id)
    .eq("kind", "rental")
    .in("status", ["requested", "confirmed"])
    .gte("week_start_friday", yearStart)
    .lte("week_start_friday", yearEnd);
  const primeCount = (ownYear ?? []).filter((r) => r.is_prime).length;
  const nonPrimeCount = (ownYear ?? []).filter((r) => !r.is_prime).length;
  if (isPrime && primeCount >= 1)
    return {
      error: `You already have a prime-week reservation in ${year}. Only one prime week per member per year.`,
    };
  if (!isPrime && nonPrimeCount >= 1)
    return {
      error: `You already have a non-prime reservation in ${year}. Only one non-prime week per member per year.`,
    };

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
