import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  fridaysOfYear,
  isPrimeFriday,
  ymd,
  formatWeekRange,
  toUtcDate,
  addDays,
  formatShort,
} from "@/lib/beach-house";

type SearchParams = Promise<{ year?: string }>;

type Entry = {
  week_start_friday: string;
  end_date: string;
  kind: "rental" | "block" | "event";
  status: "requested" | "confirmed" | "cancelled" | "completed";
  notes: string | null;
  member: { first_name: string; last_name: string } | null;
};

const STATUS_STYLES: Record<string, string> = {
  available:
    "border-[#a8a395] bg-white hover:border-[#BF5700] text-[#1a2128]",
  requested: "border-[#BF5700] bg-[#BF5700]/15 text-[#BF5700]",
  confirmed: "border-[#a8a395] bg-[#5a6470] text-[#5a6470]",
  block: "border-yellow-700/50 bg-yellow-900/20 text-yellow-200/90",
  event: "border-blue-700/50 bg-blue-900/20 text-blue-200/90",
  past: "border-[#a8a395]/30 bg-white/40 text-[#5a6470]/40",
};

function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  // Half-open: [start, end)
  return aStart < bEnd && bStart < aEnd;
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
  // Pull anything that overlaps the year — start before year-end AND end after year-start.
  const startOfYear = `${year}-01-01`;
  const endOfYear = `${year}-12-31`;
  const yearAfter = `${year + 1}-01-08`;

  const { data: reservations } = await supabase
    .from("reservations")
    .select(
      "week_start_friday, end_date, kind, status, notes, member:member_id ( first_name, last_name )",
    )
    .lte("week_start_friday", yearAfter)
    .gte("end_date", startOfYear)
    .in("status", ["requested", "confirmed"]);

  const entries = (reservations ?? []) as unknown as Entry[];
  const fridays = fridaysOfYear(year);
  const todayMs = toUtcDate(today).getTime();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 text-[#1a2128]">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-3xl font-semibold">Beach House Calendar</h1>
        <div className="flex gap-2 text-sm">
          {[currentYear, currentYear + 1, currentYear + 2].map((y) => (
            <Link
              key={y}
              href={`/dashboard/beach-house/calendar?year=${y}`}
              className={`rounded px-3 py-1 ${
                y === year
                  ? "bg-[#BF5700] text-[#1a2128]"
                  : "border border-[#a8a395] text-[#5a6470] hover:border-[#d4c89c]"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#5a6470]">
        <Legend label="Available" cls={STATUS_STYLES.available} />
        <Legend label="Pending request" cls={STATUS_STYLES.requested} />
        <Legend label="Confirmed (booked)" cls={STATUS_STYLES.confirmed} />
        <Legend label="Maintenance" cls={STATUS_STYLES.block} />
        <Legend label="Club event" cls={STATUS_STYLES.event} />
        <Legend label="Past" cls={STATUS_STYLES.past} />
        <span className="text-[#BF5700]">★ = Prime week</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fridays.map((friday) => {
          const fridayStr = ymd(friday);
          const nextFriday = ymd(addDays(friday, 7));
          const past = friday.getTime() < todayMs;
          const prime = isPrimeFriday(friday);

          // Find any entry overlapping [friday, nextFriday). Priority:
          // confirmed rental > requested rental > confirmed block > confirmed event.
          const overlapping = entries.filter((e) =>
            rangesOverlap(e.week_start_friday, e.end_date, fridayStr, nextFriday),
          );
          const rental = overlapping.find((e) => e.kind === "rental");
          const blockEntry = overlapping.find((e) => e.kind === "block");
          const eventEntry = overlapping.find((e) => e.kind === "event");
          const winner = rental ?? blockEntry ?? eventEntry ?? null;

          let kind: keyof typeof STATUS_STYLES = "available";
          let label = "";
          let interactive = false;
          if (past) {
            kind = "past";
            label = winner?.member
              ? `${winner.member.first_name} ${winner.member.last_name}`
              : winner?.notes?.replace(/^\[seed\]\s*/, "") ?? "—";
          } else if (winner?.kind === "rental") {
            kind = winner.status === "confirmed" ? "confirmed" : "requested";
            label = winner.member
              ? `${winner.status === "confirmed" ? "" : "Pending — "}${winner.member.first_name} ${winner.member.last_name}`
              : winner.status;
          } else if (winner?.kind === "block") {
            kind = "block";
            label = winner.notes?.replace(/^\[seed\]\s*/, "") ?? "Maintenance";
          } else if (winner?.kind === "event") {
            kind = "event";
            label = winner.notes?.replace(/^\[seed\]\s*/, "") ?? "Club event";
          } else {
            kind = "available";
            label = prime ? "Prime · $1,000" : "$600";
            interactive = true;
          }

          const card = (
            <div
              className={`rounded-lg border px-4 py-3 transition-colors ${
                STATUS_STYLES[kind]
              } ${interactive ? "cursor-pointer" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {formatWeekRange(friday)}
                </span>
                {prime && <span className="text-[#BF5700]">★</span>}
              </div>
              <p className="mt-1 line-clamp-2 text-xs">{label}</p>
              {winner &&
                winner.kind !== "rental" &&
                (winner.week_start_friday !== fridayStr ||
                  winner.end_date !== nextFriday) && (
                  <p className="mt-0.5 text-[10px] text-[#5a6470]/60">
                    {formatShort(toUtcDate(winner.week_start_friday))} –{" "}
                    {formatShort(toUtcDate(winner.end_date))}
                  </p>
                )}
            </div>
          );

          return interactive ? (
            <Link
              key={fridayStr}
              href={`/dashboard/beach-house/reserve?week=${fridayStr}`}
            >
              {card}
            </Link>
          ) : (
            <div key={fridayStr}>{card}</div>
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
