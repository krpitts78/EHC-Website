import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  toUtcDate,
  formatWeekRange,
  formatLong,
} from "@/lib/beach-house";
import { cancelOwnReservationAction } from "../reserve/actions";

type SearchParams = Promise<{ just?: string }>;

const STATUS_LABEL: Record<string, string> = {
  requested: "Pending approval",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

const STATUS_BADGE: Record<string, string> = {
  requested: "bg-[#BF5700] text-white",
  confirmed: "bg-green-700 text-white",
  cancelled: "bg-[#5a6470] text-white",
  completed: "bg-[#5a6470] text-white",
};

function dollars(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

export default async function MyReservationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { just } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (!member) redirect("/dashboard");

  const { data: reservations } = await supabase
    .from("reservations")
    .select(
      "id, week_start_friday, is_prime, status, rate_cents, cleaning_fee_cents, deposit_paid_at, balance_paid_at, notes",
    )
    .eq("member_id", member.id)
    .order("week_start_friday", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-[#1a2128]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-3xl font-semibold">My reservations</h1>
        <Link
          href="/dashboard/beach-house/calendar"
          className="rounded bg-[#BF5700] px-4 py-2 text-sm font-medium text-white hover:bg-[#7a3500]"
        >
          Browse calendar
        </Link>
      </div>

      {just === "requested" && (
        <p className="mt-4 rounded border border-green-600/50 bg-green-900/30 px-4 py-2 text-sm text-green-200">
          Request submitted. The VP Beach House will be in touch.
        </p>
      )}

      {(!reservations || reservations.length === 0) && (
        <p className="mt-12 text-[#5a6470]/70">
          No reservations yet. Browse the calendar to request a week.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {(reservations ?? []).map((r) => {
          const friday = toUtcDate(r.week_start_friday);
          const total = r.rate_cents + r.cleaning_fee_cents;
          const now = Date.now();
          const daysUntil = Math.ceil(
            (friday.getTime() - now) / 86_400_000,
          );
          const balanceDueSoon =
            r.status === "confirmed" &&
            !r.balance_paid_at &&
            daysUntil <= 28 &&
            daysUntil >= 0;
          const cancellationLocked =
            r.status === "confirmed" && daysUntil < 28 && daysUntil >= 0;
          return (
            <article
              key={r.id}
              className="rounded-lg border border-[#a8a395] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-medium">
                    {formatWeekRange(friday)}
                    {r.is_prime && (
                      <span className="ml-2 text-xs text-[#BF5700]">★ Prime</span>
                    )}
                  </h2>
                  <p className="text-xs text-[#5a6470]/70">
                    {formatLong(friday)} 4:00 PM
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${
                    STATUS_BADGE[r.status]
                  }`}
                >
                  {STATUS_LABEL[r.status]}
                </span>
              </div>

              {balanceDueSoon && (
                <p className="mt-3 rounded border border-amber-600/50 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  <strong>Balance due:</strong> stay starts in {daysUntil}{" "}
                  {daysUntil === 1 ? "day" : "days"}. Send the remaining{" "}
                  {dollars(total - (r.deposit_paid_at ? 10000 : 0))} via Zelle
                  (executivehuntingclub@gmail.com) or check before the start
                  date.
                </p>
              )}

              {cancellationLocked && (
                <p className="mt-3 rounded border border-red-700/40 bg-red-50 px-3 py-2 text-xs text-red-900">
                  <strong>Less than 4 weeks out:</strong> per the rules, if you
                  cancel now you&apos;re responsible for the full rental fee.
                  Contact the VP Beach House to find another renter.
                </p>
              )}

              <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                <Row label="Rate" value={dollars(r.rate_cents)} />
                <Row
                  label="Cleaning fee"
                  value={dollars(r.cleaning_fee_cents)}
                />
                <Row label="Total" value={dollars(total)} bold />
                <Row
                  label="Deposit"
                  value={r.deposit_paid_at ? "Paid" : "—"}
                />
                <Row
                  label="Balance"
                  value={r.balance_paid_at ? "Paid" : "—"}
                />
              </dl>

              {r.notes && (
                <p className="mt-3 rounded border border-[#a8a395] bg-white px-3 py-2 text-xs text-[#5a6470]">
                  Notes: {r.notes}
                </p>
              )}

              {r.status === "requested" && (
                <form
                  action={cancelOwnReservationAction}
                  className="mt-4"
                >
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-700 hover:text-red-600"
                  >
                    Cancel this request
                  </button>
                </form>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between sm:justify-start sm:gap-3">
      <dt className="text-[#5a6470]/70">{label}</dt>
      <dd className={bold ? "font-semibold text-[#1a2128]" : "text-[#1a2128]"}>
        {value}
      </dd>
    </div>
  );
}
