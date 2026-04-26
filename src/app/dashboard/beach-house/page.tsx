import Link from "next/link";

export default function BeachHousePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-white">
      <h1 className="text-3xl font-semibold">Beach House</h1>
      <p className="mt-2 text-[#D6D2C4]">
        2940 Tropicana Dr, Ramada Beach Subdivision, Bolivar Peninsula —
        ~13 miles past the Galveston Ferry on Hwy 87.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard/p/beach-house-rules"
          className="rounded-lg border border-[#333F48] bg-[#222b33] p-5 hover:border-[#BF5700]"
        >
          <h2 className="text-base font-medium text-white">Rules</h2>
          <p className="mt-1 text-sm text-[#D6D2C4]/80">
            Reservations, rates, arrival, staying, departing.
          </p>
        </Link>
        <Link
          href="/dashboard/p/beach-house-dos-donts"
          className="rounded-lg border border-[#333F48] bg-[#222b33] p-5 hover:border-[#BF5700]"
        >
          <h2 className="text-base font-medium text-white">Do's and Don'ts</h2>
          <p className="mt-1 text-sm text-[#D6D2C4]/80">
            Quick-reference checklist for any stay.
          </p>
        </Link>
        <Link
          href="/dashboard/p/beach-house-contacts"
          className="rounded-lg border border-[#333F48] bg-[#222b33] p-5 hover:border-[#BF5700]"
        >
          <h2 className="text-base font-medium text-white">Contact information</h2>
          <p className="mt-1 text-sm text-[#D6D2C4]/80">
            Utilities, vendors, housekeeper, WiFi.
          </p>
        </Link>
        <div className="rounded-lg border border-dashed border-[#333F48] bg-[#222b33]/40 p-5 text-[#D6D2C4]/60">
          <h2 className="text-base font-medium text-white/80">Calendar</h2>
          <p className="mt-1 text-sm">
            Interactive reservation calendar — coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}
