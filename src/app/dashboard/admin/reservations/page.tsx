import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  toUtcDate,
  formatWeekRange,
  formatLong,
} from "@/lib/beach-house";
import {
  approveReservationAction,
  rejectReservationAction,
  cancelReservationAction,
  markDepositPaidAction,
  markBalancePaidAction,
} from "./actions";

type ReservationRow = {
  id: string;
  week_start_friday: string;
  is_prime: boolean;
  status: string;
  rate_cents: number;
  cleaning_fee_cents: number;
  deposit_paid_at: string | null;
  balance_paid_at: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  notes: string | null;
  member: {
    first_name: string;
    last_name: string;
    member_number: string;
    email: string | null;
    phone_cell: string | null;
  } | null;
};

function dollars(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

const DAY_MS = 86_400_000;

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS);
}

function isDepositOverdue(r: ReservationRow): boolean {
  if (r.status !== "confirmed") return false;
  if (r.deposit_paid_at) return false;
  const days = daysSince(r.confirmed_at);
  return days !== null && days > 14;
}

function isLateCancellation(r: ReservationRow): boolean {
  if (r.status !== "cancelled") return false;
  if (!r.cancelled_at) return false;
  const stay = new Date(r.week_start_friday + "T00:00:00Z").getTime();
  const cancelled = new Date(r.cancelled_at).getTime();
  return stay - cancelled < 28 * DAY_MS;
}

export default async function AdminReservationsPage() {
  const supabase = await createClient();
  const result = await supabase
    .from("reservations")
    .select(
      "id, week_start_friday, is_prime, status, rate_cents, cleaning_fee_cents, deposit_paid_at, balance_paid_at, confirmed_at, cancelled_at, notes, member:member_id ( first_name, last_name, member_number, email, phone_cell )",
    )
    .order("week_start_friday", { ascending: true });
  const reservations = (result.data ?? []) as unknown as ReservationRow[];

  const pending = reservations.filter((r) => r.status === "requested");
  const confirmed = reservations.filter((r) => r.status === "confirmed");
  const past = reservations.filter(
    (r) => r.status === "cancelled" || r.status === "completed",
  );
  const overdueDeposits = confirmed.filter(isDepositOverdue);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 text-[#1a2128]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Reservations</h1>
        <Link
          href="/dashboard/admin/reservations/new"
          className="rounded bg-[#BF5700] px-4 py-2 text-sm font-medium text-white hover:bg-[#7a3500]"
        >
          + New reservation
        </Link>
      </div>

      {overdueDeposits.length > 0 && (
        <section className="mt-6 rounded-lg border border-amber-700/50 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-900">
            Deposit overdue ({overdueDeposits.length})
          </h2>
          <p className="mt-1 text-xs text-amber-900/80">
            Confirmed more than 14 days ago and the $100 deposit hasn&apos;t
            been recorded. Reach out to the member.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-amber-900">
            {overdueDeposits.map((r) => (
              <li key={r.id}>
                <strong>
                  {r.member?.first_name} {r.member?.last_name}
                </strong>{" "}
                · {formatWeekRange(toUtcDate(r.week_start_friday))} · confirmed{" "}
                {daysSince(r.confirmed_at)} days ago
                {r.member?.email && (
                  <>
                    {" · "}
                    <a
                      href={`mailto:${r.member.email}`}
                      className="text-[#BF5700] hover:underline"
                    >
                      {r.member.email}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Section title={`Pending requests (${pending.length})`}>
        {pending.length === 0 ? (
          <p className="text-sm text-[#5a6470]/70">Nothing pending.</p>
        ) : (
          pending.map((r) => <PendingCard key={r.id} r={r} />)
        )}
      </Section>

      <Section title={`Confirmed (${confirmed.length})`}>
        {confirmed.length === 0 ? (
          <p className="text-sm text-[#5a6470]/70">No confirmed bookings.</p>
        ) : (
          confirmed.map((r) => <ConfirmedCard key={r.id} r={r} />)
        )}
      </Section>

      <Section title={`Past / cancelled (${past.length})`}>
        {past.length === 0 ? (
          <p className="text-sm text-[#5a6470]/70">None.</p>
        ) : (
          past.map((r) => <PastCard key={r.id} r={r} />)
        )}
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-[#5a6470]">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function MemberLine({ r }: { r: ReservationRow }) {
  const m = r.member;
  if (!m) return null;
  return (
    <p className="text-xs text-[#5a6470]/80">
      {m.first_name} {m.last_name} · {m.member_number}
      {m.email && (
        <>
          {" · "}
          <a className="text-[#BF5700] hover:underline" href={`mailto:${m.email}`}>
            {m.email}
          </a>
        </>
      )}
      {m.phone_cell && ` · ${m.phone_cell}`}
    </p>
  );
}

function WeekHeader({ r }: { r: ReservationRow }) {
  const friday = toUtcDate(r.week_start_friday);
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-medium">
          {formatWeekRange(friday)}
          {r.is_prime && (
            <span className="ml-2 text-xs text-[#BF5700]">★ Prime</span>
          )}
          <span className="ml-2 text-xs text-[#5a6470]/60">
            ({formatLong(friday)})
          </span>
        </h3>
        <MemberLine r={r} />
      </div>
      <Link
        href={`/dashboard/admin/reservations/${r.id}/edit`}
        className="shrink-0 rounded border border-[#a8a395] px-2 py-1 text-xs text-[#5a6470] hover:bg-[#D6D2C4]"
      >
        Edit
      </Link>
    </div>
  );
}

function PendingCard({ r }: { r: ReservationRow }) {
  const total = r.rate_cents + r.cleaning_fee_cents;
  return (
    <article className="rounded-lg border border-[#BF5700]/50 bg-white p-4">
      <WeekHeader r={r} />
      <p className="mt-2 text-sm text-[#5a6470]">
        Rate {dollars(r.rate_cents)} + cleaning {dollars(r.cleaning_fee_cents)} ={" "}
        <span className="font-medium text-[#1a2128]">{dollars(total)}</span>
      </p>
      {r.notes && (
        <p className="mt-2 text-xs text-[#5a6470]/80">Notes: {r.notes}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <form action={approveReservationAction}>
          <input type="hidden" name="id" value={r.id} />
          <button
            type="submit"
            className="rounded bg-green-700 px-3 py-1 text-sm font-medium text-white hover:bg-green-600"
          >
            Approve
          </button>
        </form>
        <form action={rejectReservationAction} className="flex flex-wrap gap-2 sm:flex-nowrap">
          <input type="hidden" name="id" value={r.id} />
          <input
            type="text"
            name="reason"
            placeholder="Reject reason (optional)"
            className="min-w-0 flex-1 rounded border border-[#a8a395] bg-white px-2 py-1 text-xs text-[#1a2128]"
          />
          <button
            type="submit"
            className="rounded border border-red-500/60 px-3 py-1 text-sm text-red-300 hover:bg-red-900/30"
          >
            Reject
          </button>
        </form>
      </div>
    </article>
  );
}

function ConfirmedCard({ r }: { r: ReservationRow }) {
  const total = r.rate_cents + r.cleaning_fee_cents;
  const overdue = isDepositOverdue(r);
  return (
    <article
      className={`rounded-lg border p-4 ${
        overdue
          ? "border-amber-600/60 bg-amber-50"
          : "border-[#a8a395] bg-white"
      }`}
    >
      <WeekHeader r={r} />
      {overdue && (
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-900">
          Deposit overdue · {daysSince(r.confirmed_at)} days since confirmation
        </p>
      )}
      <p className="mt-2 text-sm text-[#5a6470]">
        Total {dollars(total)} ·{" "}
        <span className={r.deposit_paid_at ? "text-green-700" : "text-amber-700"}>
          deposit {r.deposit_paid_at ? "paid" : "outstanding"}
        </span>{" "}
        ·{" "}
        <span className={r.balance_paid_at ? "text-green-700" : "text-amber-700"}>
          balance {r.balance_paid_at ? "paid" : "outstanding"}
        </span>
      </p>
      {r.notes && (
        <p className="mt-2 text-xs text-[#5a6470]/80">Notes: {r.notes}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <form action={markDepositPaidAction}>
          <input type="hidden" name="id" value={r.id} />
          <input type="hidden" name="paid" value={r.deposit_paid_at ? "false" : "true"} />
          <button
            type="submit"
            className="rounded border border-[#d4c89c]/40 px-3 py-1 text-xs text-[#5a6470] hover:border-[#d4c89c] hover:text-[#1a2128]"
          >
            {r.deposit_paid_at ? "Unmark deposit paid" : "Mark deposit paid"}
          </button>
        </form>
        <form action={markBalancePaidAction}>
          <input type="hidden" name="id" value={r.id} />
          <input type="hidden" name="paid" value={r.balance_paid_at ? "false" : "true"} />
          <button
            type="submit"
            className="rounded border border-[#d4c89c]/40 px-3 py-1 text-xs text-[#5a6470] hover:border-[#d4c89c] hover:text-[#1a2128]"
          >
            {r.balance_paid_at ? "Unmark balance paid" : "Mark balance paid"}
          </button>
        </form>
        <form action={cancelReservationAction}>
          <input type="hidden" name="id" value={r.id} />
          <button
            type="submit"
            className="rounded border border-red-500/60 px-3 py-1 text-xs text-red-300 hover:bg-red-900/30"
          >
            Cancel
          </button>
        </form>
      </div>
    </article>
  );
}

function PastCard({ r }: { r: ReservationRow }) {
  const lateCancel = isLateCancellation(r);
  return (
    <article
      className={`rounded-lg border p-3 text-sm ${
        lateCancel
          ? "border-red-700/40 bg-red-50 text-red-900"
          : "border-[#a8a395]/60 bg-white/40 text-[#5a6470]/80"
      }`}
    >
      <WeekHeader r={r} />
      {lateCancel && (
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-900">
          Late cancellation · member liable for full rental fee
        </p>
      )}
      <p className="mt-1 text-xs">
        Status: {r.status}
        {r.notes && ` · ${r.notes}`}
      </p>
    </article>
  );
}
