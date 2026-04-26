import Link from "next/link";

export default function BeachHousePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-[#1a2128]">
      <h1 className="text-3xl font-semibold">Beach House</h1>
      <p className="mt-2 text-[#5a6470]">
        2940 Tropicana Dr, Ramada Beach Subdivision, Bolivar Peninsula —
        ~13 miles past the Galveston Ferry on Hwy 87.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard/beach-house/calendar"
          className="rounded-lg border border-[#a8a395] bg-white p-5 hover:border-[#BF5700]"
        >
          <h2 className="text-base font-medium text-[#1a2128]">Calendar</h2>
          <p className="mt-1 text-sm text-[#5a6470]/80">
            Browse open weeks and request a reservation.
          </p>
        </Link>
        <Link
          href="/dashboard/beach-house/my-reservations"
          className="rounded-lg border border-[#a8a395] bg-white p-5 hover:border-[#BF5700]"
        >
          <h2 className="text-base font-medium text-[#1a2128]">My reservations</h2>
          <p className="mt-1 text-sm text-[#5a6470]/80">
            Status, payments, and history of your bookings.
          </p>
        </Link>
        <Link
          href="/dashboard/p/beach-house-rules"
          className="rounded-lg border border-[#a8a395] bg-white p-5 hover:border-[#BF5700]"
        >
          <h2 className="text-base font-medium text-[#1a2128]">Rules</h2>
          <p className="mt-1 text-sm text-[#5a6470]/80">
            Reservations, rates, arrival, staying, departing.
          </p>
        </Link>
        <Link
          href="/dashboard/p/beach-house-dos-donts"
          className="rounded-lg border border-[#a8a395] bg-white p-5 hover:border-[#BF5700]"
        >
          <h2 className="text-base font-medium text-[#1a2128]">Do's and Don'ts</h2>
          <p className="mt-1 text-sm text-[#5a6470]/80">
            Quick-reference checklist for any stay.
          </p>
        </Link>
        <Link
          href="/dashboard/p/beach-house-contacts"
          className="rounded-lg border border-[#a8a395] bg-white p-5 hover:border-[#BF5700]"
        >
          <h2 className="text-base font-medium text-[#1a2128]">Contact information</h2>
          <p className="mt-1 text-sm text-[#5a6470]/80">
            Utilities, vendors, housekeeper, WiFi.
          </p>
        </Link>
      </div>
    </main>
  );
}
