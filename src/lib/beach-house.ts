// Beach house reservation helpers. All dates are treated as date-only (no time).
// We use UTC to avoid DST surprises when comparing/iterating.

export const PRIME_RATE_CENTS = 100000; // $1,000/wk
export const NON_PRIME_RATE_CENTS = 60000; // $600/wk
export const CLEANING_FEE_CENTS = 12500; // $125

const DAY_MS = 86_400_000;

/** Return a UTC midnight Date for a YYYY-MM-DD string or Date. */
export function toUtcDate(d: string | Date): Date {
  if (d instanceof Date) {
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    );
  }
  const [y, m, day] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

export function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY_MS);
}

/** dow: 0=Sun, 5=Fri */
export function dow(d: Date): number {
  return d.getUTCDay();
}

/** All Fridays in a given calendar year. */
export function fridaysOfYear(year: number): Date[] {
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const offsetToFriday = (5 - dow(jan1) + 7) % 7;
  const firstFriday = addDays(jan1, offsetToFriday);
  const out: Date[] = [];
  let d = firstFriday;
  while (d.getUTCFullYear() === year) {
    out.push(d);
    d = addDays(d, 7);
  }
  return out;
}

/**
 * Prime window for a given year:
 * Friday before the first full week in May (i.e. Friday before the first Sunday of May)
 * through Friday after Labor Day (first Monday of September + 4 days).
 */
export function primeWindow(year: number): { start: Date; end: Date } {
  const may1 = new Date(Date.UTC(year, 4, 1));
  const firstSundayOfMay = addDays(may1, (7 - dow(may1)) % 7);
  const start = addDays(firstSundayOfMay, -2); // Friday before

  const sep1 = new Date(Date.UTC(year, 8, 1));
  const offsetToMonday = (1 - dow(sep1) + 7) % 7;
  const laborDay = addDays(sep1, offsetToMonday);
  const end = addDays(laborDay, 4); // Friday after Labor Day

  return { start, end };
}

export function isPrimeFriday(friday: Date): boolean {
  const { start, end } = primeWindow(friday.getUTCFullYear());
  return friday.getTime() >= start.getTime() && friday.getTime() <= end.getTime();
}

export function rateCentsFor(isPrime: boolean): number {
  return isPrime ? PRIME_RATE_CENTS : NON_PRIME_RATE_CENTS;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatShort(d: Date): string {
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function formatWeekRange(friday: Date): string {
  const next = addDays(friday, 7);
  return `${formatShort(friday)} – ${formatShort(next)}`;
}

export function formatLong(d: Date): string {
  const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getUTCDay()];
  return `${weekday}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
