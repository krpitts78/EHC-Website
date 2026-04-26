import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import {
  CLEANING_FEE_CENTS,
  isPrimeFriday,
  rateCentsFor,
  toUtcDate,
  formatWeekRange,
  formatLong,
  ymd,
} from "@/lib/beach-house";
import { ReserveForm } from "./ReserveForm";

type SearchParams = Promise<{ week?: string }>;

function dollars(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

export default async function ReservePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { week } = await searchParams;
  if (!week || !/^\d{4}-\d{2}-\d{2}$/.test(week)) notFound();

  const friday = toUtcDate(week);
  if (friday.getUTCDay() !== 5) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("members")
    .select("id, first_name, last_name, is_prime_list")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (!member) notFound();

  const existingResult = await supabase
    .from("reservations")
    .select("id, status, member:member_id ( first_name, last_name )")
    .eq("week_start_friday", week)
    .in("status", ["requested", "confirmed"])
    .maybeSingle();
  const existing = existingResult.data as
    | {
        id: string;
        status: "requested" | "confirmed";
        member: { first_name: string; last_name: string } | null;
      }
    | null;

  const prime = isPrimeFriday(friday);
  const rateCents = rateCentsFor(prime);
  const totalCents = rateCents + CLEANING_FEE_CENTS;
  const past = friday.getTime() < toUtcDate(new Date()).getTime();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 text-[#1a2128]">
      <p className="text-xs uppercase tracking-wide text-[#5a6470]/60">
        Reserve beach house
      </p>
      <h1 className="mt-1 text-3xl font-semibold">{formatWeekRange(friday)}</h1>
      <p className="mt-1 text-sm text-[#5a6470]">
        Friday {formatLong(friday)} 4:00 PM → Friday 12:00 PM (
        {prime ? "Prime week" : "Non-Prime week"})
      </p>

      <section className="mt-6 rounded-lg border border-[#a8a395] bg-white p-5 text-sm">
        <dl className="space-y-2">
          <Row label="Weekly rate" value={dollars(rateCents)} />
          <Row label="Housekeeping fee" value={dollars(CLEANING_FEE_CENTS)} />
          <Row label="Total" value={dollars(totalCents)} bold />
        </dl>
      </section>

      {past && (
        <p className="mt-6 text-red-400">
          That week is in the past — cannot reserve.
        </p>
      )}

      {!past && existing && (
        <p className="mt-6 text-amber-300">
          This week already has a {existing.status === "confirmed" ? "confirmed booking" : "pending request"}
          {existing.member &&
            ` from ${existing.member.first_name} ${existing.member.last_name}`}
          .
        </p>
      )}

      {!past && !existing && prime && !member.is_prime_list && (
        <p className="mt-6 text-amber-300">
          Prime weeks are reservable only by members on the prime-time list.
          Contact the VP Beach House if you believe this is wrong.
        </p>
      )}

      {!past && !existing && (!prime || member.is_prime_list) && (
        <ReserveForm
          week={ymd(friday)}
          totalCents={totalCents}
          memberName={`${member.first_name} ${member.last_name}`}
        />
      )}
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
    <div className="flex justify-between">
      <dt className="text-[#5a6470]">{label}</dt>
      <dd className={bold ? "font-semibold text-[#1a2128]" : "text-[#1a2128]"}>
        {value}
      </dd>
    </div>
  );
}
