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

export default async function AdminReservationsPage() {
  const supabase = await createClient();
  const result = await supabase
    .from("reservations")
    .select(
      "id, week_start_friday, is_prime, status, rate_cents, cleaning_fee_cents, deposit_paid_at, balance_paid_at, notes, member:member_id ( first_name, last_name, member_number, email, phone_cell )",
    )
    .order("week_start_friday", { ascending: true });
  const reservations = (result.data ?? []) as unknown as ReservationRow[];

  const pending = reservations.filter((r) => r.status === "requested");
  const confirmed = reservations.filter((r) => r.status === "confirmed");
  const past = reservations.filter(
    (r) => r.status === "cancelled" || r.status === "completed",
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 text-[#1a2128]">
      <h1 className="text-3xl font-semibold">Reservations</h1>

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
  return (
    <article className="rounded-lg border border-[#a8a395] bg-white p-4">
      <WeekHeader r={r} />
      <p className="mt-2 text-sm text-[#5a6470]">
        Total {dollars(total)} ·{" "}
        <span className={r.deposit_paid_at ? "text-green-300" : "text-amber-300"}>
          deposit {r.deposit_paid_at ? "paid" : "outstanding"}
        </span>{" "}
        ·{" "}
        <span className={r.balance_paid_at ? "text-green-300" : "text-amber-300"}>
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
  return (
    <article className="rounded-lg border border-[#a8a395]/60 bg-white/40 p-3 text-sm text-[#5a6470]/80">
      <WeekHeader r={r} />
      <p className="mt-1 text-xs text-[#5a6470]/60">
        Status: {r.status}
        {r.notes && ` · ${r.notes}`}
      </p>
    </article>
  );
}
