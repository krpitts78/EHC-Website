// Seed historical reservations + blocks/events from the 2026 + 2027 calendar PDFs.
// Idempotent: deletes any pre-existing seeded rows (kind in rental,block,event with
// notes prefixed "[seed:") before re-inserting.
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

async function loadEnv() {
  const env = {};
  const txt = await readFile(".env.local", "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

const NAME_TO_MEMBER_NUMBER = {
  "Keith Gier": "R-653-08",
  "Justin Thomson": "R-699-17",
  "Juston Thomson": "R-699-17",
  "Jeremy Williams": "R-712-20",
  "Cliff Netterville": "R-584-98",
  "Clifton Netterville": "R-584-98",
  "Doug Krummel": "R-636-04",
  "Doug Krumel": "R-636-04",
  "Billy Hearn": "R-664-10",
  "Troy Smith": "R-622-02",
  "Scott Broughton": "R-719-23",
  "Barry Hamblett": "R-670-11",
  "Carmel McElyea": "R-728-74",
  "Ricky Sammon": "R-637-04",
  "Ricky Sammons": "R-637-04",
  "Charles Blank": "R-642-06",
  "Chuck Blank": "R-642-06",
  "Art Oswald": "R-640-05",
  "John Shumacher": "R-687-15",
  "John Schumacher": "R-687-15",
  "Shawn Dick": "R-704-18",
  "Sean Dick": "R-704-18",
  "Tannie Shannon": "C-170-74",
  "Matthew Jozwiak": "R-709-19",
  "Matt Jozwiak": "R-709-19",
  "Mike Rys": "R-614-01",
  "Mike Reagan": "R-674-12",
  "Don Guyton": "R-539-93",
  "Clay Hamblett": "R-714-20",
  "Gary Sorrel": "R-692-16",
  "Garry Sorrell": "R-692-16",
  "Scott Davis": "R-682-14",
  "Tom Barns": "R-626-03",
  "Thomas Barnes": "R-626-03",
  "Jerry Hemphill": "R-693-16",
  "Larry Deem": "R-656-10",
  "Otoniel Macedo": "R-734-25",
  "Mike Swonke": "R-666-10",
  "Dave Weaver": "R-667-11",
  "Brandon Corman": "R-724-23",
};

// Parse "MM/DD/YYYY" or "MM/DD/YY" → "YYYY-MM-DD"
function parsePaidDate(s) {
  if (!s) return null;
  const m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (!m) return null;
  let [, mm, dd, yy] = m;
  if (yy.length === 2) yy = "20" + yy;
  return `${yy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

function rental({ start, end, name, rate, paid, paidDate, notes }) {
  return {
    name,
    start_date: start,
    end_date: end,
    rate_cents: rate * 100,
    cleaning_fee_cents: 12500,
    paid_full: paid >= rate,
    paid_partial: paid > 0 && paid < rate,
    paid_date: parsePaidDate(paidDate),
    notes: `[seed] ${notes}`,
  };
}

function block({ start, end, kind, notes }) {
  return {
    start_date: start,
    end_date: end,
    kind,
    notes: `[seed] ${notes}`,
  };
}

const RENTALS_2026 = [
  rental({ start: "2025-12-26", end: "2026-01-02", name: "Keith Gier", rate: 600, paid: 600, paidDate: "12/18/2025", notes: "New Years week. Reserved 12/30/24 Zelle." }),
  rental({ start: "2026-01-02", end: "2026-01-09", name: "Justin Thomson", rate: 400, paid: 400, paidDate: "12/11/2025", notes: "Reserved Zelle." }),
  rental({ start: "2026-01-09", end: "2026-01-16", name: "Jeremy Williams", rate: 600, paid: 600, paidDate: "01/04/2026", notes: "Reserved 2/5/25 Zelle." }),
  rental({ start: "2026-01-16", end: "2026-01-23", name: "Cliff Netterville", rate: 600, paid: 600, paidDate: "12/17/2025", notes: "Reserved 5/28/25 Ck# 5627." }),
  rental({ start: "2026-01-23", end: "2026-01-30", name: "Doug Krummel", rate: 400, paid: 400, paidDate: "01/05/2026", notes: "Reserved 11/19/25 Ck#4447." }),
  rental({ start: "2026-01-30", end: "2026-02-06", name: "Billy Hearn", rate: 400, paid: 400, paidDate: "12/01/2025", notes: "Reserved 11/19/25 Ck# 2250." }),
  rental({ start: "2026-02-06", end: "2026-02-10", name: "Troy Smith", rate: 300, paid: 300, paidDate: "01/23/2026", notes: "Short Week. Reserved 2/13/25 Zelle." }),
  rental({ start: "2026-02-20", end: "2026-02-27", name: "Scott Broughton", rate: 600, paid: 600, paidDate: "06/24/2025", notes: "Reserved 6/12/25 Ck# 224." }),
  rental({ start: "2026-02-27", end: "2026-03-06", name: "Jeremy Williams", rate: 600, paid: 600, paidDate: "02/14/2026", notes: "Reserved 10/6/25 Zelle." }),
  rental({ start: "2026-03-06", end: "2026-03-13", name: "Barry Hamblett", rate: 600, paid: 600, paidDate: "02/18/2026", notes: "Reserved 3/6/25 Ck#8739." }),
  rental({ start: "2026-03-13", end: "2026-03-20", name: "Carmel McElyea", rate: 600, paid: 600, paidDate: "02/27/2026", notes: "Reserved 6/12/25 Ck# 7924." }),
  rental({ start: "2026-03-20", end: "2026-03-27", name: "Ricky Sammon", rate: 600, paid: 600, paidDate: "02/25/2026", notes: "Reserved 4/24/25 Ck# 6704." }),
  rental({ start: "2026-03-27", end: "2026-04-03", name: "Charles Blank", rate: 600, paid: 600, paidDate: "03/18/2026", notes: "Reserved 3/27/25 Zelle." }),
  rental({ start: "2026-04-03", end: "2026-04-10", name: "Art Oswald", rate: 600, paid: 600, paidDate: "02/12/2026", notes: "Easter Weekend. Reserved 4/24/25 Ck." }),
  rental({ start: "2026-04-10", end: "2026-04-17", name: "John Shumacher", rate: 600, paid: 100, paidDate: "06/13/2025", notes: "Reserved 4/10/25 Ck 8451." }),
  rental({ start: "2026-04-17", end: "2026-04-24", name: "Shawn Dick", rate: 600, paid: 250, paidDate: "01/16/2026", notes: "Reserved 4/17/25 Zelle." }),
  rental({ start: "2026-04-24", end: "2026-05-01", name: "Troy Smith", rate: 600, paid: 600, paidDate: "03/26/2026", notes: "Reserved 4/24/25 Zelle." }),
  rental({ start: "2026-05-01", end: "2026-05-08", name: "Tannie Shannon", rate: 1000, paid: 1000, paidDate: "01/23/2026", notes: "Reserved 5/13/25 Ck# 90026." }),
  rental({ start: "2026-05-08", end: "2026-05-15", name: "Matthew Jozwiak", rate: 1000, paid: 1000, paidDate: "01/08/2026", notes: "Reserved 5/23/25 Zelle." }),
  rental({ start: "2026-05-15", end: "2026-05-22", name: "Mike Rys", rate: 1000, paid: 1000, paidDate: "06/04/2025", notes: "Jeep Weekend / Spring Trip. Reserved 5/15/25 CK#1628." }),
  rental({ start: "2026-05-22", end: "2026-05-29", name: "Mike Reagan", rate: 1000, paid: 0, paidDate: null, notes: "Memorial Weekend. Reserved 5/23/25." }),
  rental({ start: "2026-05-29", end: "2026-06-05", name: "Don Guyton", rate: 1000, paid: 0, paidDate: null, notes: "Reserved 5/30/25." }),
  rental({ start: "2026-06-05", end: "2026-06-12", name: "Clay Hamblett", rate: 1000, paid: 0, paidDate: null, notes: "Reserved 6/5/25." }),
  rental({ start: "2026-06-12", end: "2026-06-19", name: "Art Oswald", rate: 1000, paid: 100, paidDate: "02/12/2026", notes: "Reserved 6/12/25 Ck." }),
  rental({ start: "2026-06-19", end: "2026-06-26", name: "Gary Sorrel", rate: 1000, paid: 0, paidDate: null, notes: "Reserved 6/20/25." }),
  rental({ start: "2026-07-03", end: "2026-07-10", name: "Scott Davis", rate: 1000, paid: 0, paidDate: null, notes: "July 4th. Reserved 7/3/25." }),
  rental({ start: "2026-07-10", end: "2026-07-17", name: "Tom Barns", rate: 1000, paid: 0, paidDate: null, notes: "Reserved 7/10/25." }),
  rental({ start: "2026-07-17", end: "2026-07-24", name: "Jeremy Williams", rate: 1000, paid: 0, paidDate: null, notes: "Reserved 7/17/25." }),
  rental({ start: "2026-07-24", end: "2026-07-31", name: "Jerry Hemphill", rate: 1000, paid: 0, paidDate: null, notes: "Reserved 7/24/25." }),
  rental({ start: "2026-07-31", end: "2026-08-07", name: "Larry Deem", rate: 1000, paid: 0, paidDate: null, notes: "Reserved 7/31/25." }),
  rental({ start: "2026-08-07", end: "2026-08-14", name: "Barry Hamblett", rate: 1000, paid: 0, paidDate: null, notes: "Reserved 8/7/25." }),
  rental({ start: "2026-08-14", end: "2026-08-21", name: "Carmel McElyea", rate: 1000, paid: 100, paidDate: "08/17/2025", notes: "Reserved 8/14/25 Ck# 7722." }),
  rental({ start: "2026-08-21", end: "2026-08-28", name: "Otoniel Macedo", rate: 1000, paid: 1000, paidDate: "10/27/2025", notes: "Reserved 11/28/25 Ck# 5807." }),
  rental({ start: "2026-09-04", end: "2026-09-11", name: "Troy Smith", rate: 1000, paid: 0, paidDate: null, notes: "Labor Day Weekend. Reserved 9/25/25." }),
  rental({ start: "2026-09-11", end: "2026-09-18", name: "Mike Reagan", rate: 600, paid: 0, paidDate: null, notes: "Reserved 9/26/25." }),
  rental({ start: "2026-09-18", end: "2026-09-25", name: "Mike Swonke", rate: 600, paid: 0, paidDate: null, notes: "Reserved 12/10/25." }),
  rental({ start: "2026-09-25", end: "2026-10-02", name: "Chuck Blank", rate: 600, paid: 0, paidDate: null, notes: "Reserved 9/26/25." }),
  rental({ start: "2026-10-09", end: "2026-10-16", name: "Dave Weaver", rate: 600, paid: 0, paidDate: null, notes: "Reserved 10/9/25." }),
  rental({ start: "2026-11-06", end: "2026-11-13", name: "Doug Krummel", rate: 600, paid: 0, paidDate: null, notes: "Reserved 11/12/25." }),
  rental({ start: "2026-11-20", end: "2026-11-27", name: "Mike Rys", rate: 600, paid: 600, paidDate: "12/03/2025", notes: "Thanksgiving Ck# 1635." }),
  rental({ start: "2026-12-18", end: "2026-12-25", name: "Tannie Shannon", rate: 600, paid: 0, paidDate: null, notes: "Christmas. Reserved 1/7/26." }),
  rental({ start: "2026-12-25", end: "2027-01-01", name: "Brandon Corman", rate: 600, paid: 0, paidDate: null, notes: "New Years Eve / Day. Reserved 12/25/25." }),
];

const BLOCKS_2026 = [
  block({ start: "2026-02-10", end: "2026-02-14", kind: "event", notes: "EHC Board Meeting." }),
  block({ start: "2026-02-16", end: "2026-02-20", kind: "block", notes: "Maintenance week." }),
  block({ start: "2026-08-28", end: "2026-09-04", kind: "block", notes: "Maintenance week (reserved by Board 2/13/26)." }),
  block({ start: "2026-10-02", end: "2026-10-09", kind: "block", notes: "Maintenance week." }),
  block({ start: "2026-10-16", end: "2026-10-23", kind: "event", notes: "Fall Dove Trip Weekend." }),
];

const RENTALS_2027 = [
  rental({ start: "2027-01-08", end: "2027-01-15", name: "Jeremy Williams", rate: 600, paid: 0, paidDate: null, notes: "Reserved 1/8/26." }),
  rental({ start: "2027-01-15", end: "2027-01-22", name: "Cliff Netterville", rate: 600, paid: 0, paidDate: null, notes: "Reserved 3/3/26." }),
  rental({ start: "2027-01-29", end: "2027-02-02", name: "Troy Smith", rate: 300, paid: 0, paidDate: null, notes: "Short Week." }),
  rental({ start: "2027-03-12", end: "2027-03-19", name: "Troy Smith", rate: 600, paid: 0, paidDate: null, notes: "Reserved 3/12/26." }),
  rental({ start: "2027-03-19", end: "2027-03-26", name: "Carmel McElyea", rate: 600, paid: 0, paidDate: null, notes: "Reserved 3/19/26." }),
];

const BLOCKS_2027 = [
  block({ start: "2027-02-03", end: "2027-02-07", kind: "event", notes: "EHC Board Meeting." }),
  block({ start: "2027-02-08", end: "2027-02-12", kind: "block", notes: "Maintenance week." }),
  block({ start: "2027-10-08", end: "2027-10-15", kind: "event", notes: "Fall Dove Trip." }),
];

async function main() {
  const env = await loadEnv();
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  // Wipe prior seed rows.
  await supabase
    .from("reservations")
    .delete()
    .like("notes", "[seed]%");

  const { data: members } = await supabase
    .from("members")
    .select("id, member_number");
  const memberIdByNumber = new Map(
    (members ?? []).map((m) => [m.member_number, m.id]),
  );

  const rentalRows = [];
  const unmatched = [];
  for (const r of [...RENTALS_2026, ...RENTALS_2027]) {
    const memNum = NAME_TO_MEMBER_NUMBER[r.name];
    const memberId = memNum ? memberIdByNumber.get(memNum) : null;
    if (!memberId) {
      unmatched.push(r.name);
      continue;
    }
    const isPrime = r.rate_cents >= 100000;
    rentalRows.push({
      member_id: memberId,
      week_start_friday: r.start_date,
      end_date: r.end_date,
      kind: "rental",
      is_prime: isPrime,
      status: "confirmed",
      rate_cents: r.rate_cents,
      cleaning_fee_cents: r.cleaning_fee_cents,
      deposit_paid_at: r.paid_partial || r.paid_full ? r.paid_date : null,
      balance_paid_at: r.paid_full ? r.paid_date : null,
      confirmed_at: r.paid_date ?? r.start_date,
      notes: r.notes,
    });
  }

  const blockRows = [...BLOCKS_2026, ...BLOCKS_2027].map((b) => ({
    member_id: null,
    week_start_friday: b.start_date,
    end_date: b.end_date,
    kind: b.kind,
    is_prime: false,
    status: "confirmed",
    rate_cents: 0,
    cleaning_fee_cents: 0,
    notes: b.notes,
  }));

  const allRows = [...rentalRows, ...blockRows];
  const { error } = await supabase.from("reservations").insert(allRows);
  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${rentalRows.length} rentals + ${blockRows.length} blocks/events.`);
  if (unmatched.length) {
    console.log("\nUnmatched names (skipped):");
    for (const n of unmatched) console.log(`  ${n}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
