import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  fridaysOfYear,
  isPrimeFriday,
  ymd,
  formatWeekRange,
  toUtcDate,
} from "@/lib/beach-house";

type SearchParams = Promise<{ year?: string }>;

type Reservation = {
  week_start_friday: string;
  status: "requested" | "confirmed" | "cancelled" | "completed";
  member: { first_name: string; last_name: string } | null;
};

const STATUS_STYLES: Record<string, string> = {
  available:
    "border-[#333F48] bg-[#222b33] hover:border-[#BF5700] text-white",
  requested:
    "border-[#BF5700] bg-[#BF5700]/15 text-[#F8971F]",
  confirmed:
    "border-[#333F48] bg-[#333F48] text-[#D6D2C4]",
  past:
    "border-[#333F48]/30 bg-[#222b33]/40 text-[#D6D2C4]/40",
};

function statusBadge(status: keyof typeof STATUS_STYLES): string {
  return STATUS_STYLES[status];
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const today = new Date();
  const currentYear = today.getUTCFullYear();
  const year = Number(params.year ?? currentYear);

  const supabase = await createClient();
  const startOfYear = `${year}-01-01`;
  const endOfYear = `${year}-12-31`;

  const { data: reservations } = await supabase
    .from("reservations")
    .select(
      "week_start_friday, status, member:member_id ( first_name, last_name )",
    )
    .gte("week_start_friday", startOfYear)
    .lte("week_start_friday", endOfYear)
    .in("status", ["requested", "confirmed"]);

  const byWeek = new Map<string, Reservation>();
  for (const r of (reservations ?? []) as unknown as Reservation[]) {
    byWeek.set(r.week_start_friday, r);
  }

  const fridays = fridaysOfYear(year);
  const todayMs = toUtcDate(today).getTime();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 text-white">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-3xl font-semibold">Beach House Calendar</h1>
        <div className="flex gap-2 text-sm">
          {[currentYear, currentYear + 1, currentYear + 2].map((y) => (
            <Link
              key={y}
              href={`/dashboard/beach-house/calendar?year=${y}`}
              className={`rounded px-3 py-1 ${
                y === year
                  ? "bg-[#BF5700] text-white"
                  : "border border-[#333F48] text-[#D6D2C4] hover:border-[#D6D2C4]"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#D6D2C4]">
        <Legend label="Available" cls={STATUS_STYLES.available} />
        <Legend label="Pending request" cls={STATUS_STYLES.requested} />
        <Legend label="Confirmed (booked)" cls={STATUS_STYLES.confirmed} />
        <Legend label="Past" cls={STATUS_STYLES.past} />
        <span className="text-[#F8971F]">★ = Prime week</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fridays.map((friday) => {
          const fridayStr = ymd(friday);
          const res = byWeek.get(fridayStr);
          const past = friday.getTime() < todayMs;
          const prime = isPrimeFriday(friday);

          let kind: keyof typeof STATUS_STYLES = "available";
          if (past) kind = "past";
          else if (res?.status === "confirmed") kind = "confirmed";
          else if (res?.status === "requested") kind = "requested";

          const interactive = kind === "available";

          const inner = (
            <div
              className={`rounded-lg border px-4 py-3 transition-colors ${statusBadge(
                kind,
              )} ${interactive ? "cursor-pointer" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {formatWeekRange(friday)}
                </span>
                {prime && <span className="text-[#F8971F]">★</span>}
              </div>
              <p className="mt-1 text-xs">
                {kind === "available" && (prime ? "Prime · $1,000" : "$600")}
                {kind === "requested" && res?.member &&
                  `Pending — ${res.member.first_name} ${res.member.last_name}`}
                {kind === "confirmed" && res?.member &&
                  `${res.member.first_name} ${res.member.last_name}`}
                {kind === "past" && "—"}
              </p>
            </div>
          );

          return interactive ? (
            <Link
              key={fridayStr}
              href={`/dashboard/beach-house/reserve?week=${fridayStr}`}
            >
              {inner}
            </Link>
          ) : (
            <div key={fridayStr}>{inner}</div>
          );
        })}
      </div>
    </main>
  );
}

function Legend({ label, cls }: { label: string; cls: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-block h-3 w-3 rounded border ${cls}`} />
      {label}
    </span>
  );
}
