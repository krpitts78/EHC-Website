"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createReservationAction, type ReserveState } from "./actions";

const initial: ReserveState = {};

export function ReserveForm({
  week,
  memberName,
  totalCents,
}: {
  week: string;
  memberName: string;
  totalCents: number;
}) {
  const [state, formAction, pending] = useActionState(
    createReservationAction,
    initial,
  );

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <input type="hidden" name="week" value={week} />

      <div className="rounded border border-[#333F48] bg-[#222b33]/60 px-4 py-3 text-sm">
        <span className="text-[#D6D2C4]">Reserving as</span>{" "}
        <span className="font-medium">{memberName}</span>
      </div>

      <label className="block text-sm">
        <span className="text-[#D6D2C4]">Notes for VP Beach House (optional)</span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Anything to flag — number of guests, late arrival, etc."
          className="mt-1 w-full rounded border border-[#333F48] bg-[#222b33] px-3 py-2 text-white focus:border-[#BF5700] focus:outline-none"
        />
      </label>

      {state.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}

      <p className="text-xs text-[#D6D2C4]/70">
        After submitting, the request goes to the VP Beach House for approval.
        Once confirmed, send your $100 deposit (Zelle or check) within 2 weeks
        to hold the reservation. Total of ${(totalCents / 100).toLocaleString()}{" "}
        is due 4 weeks before the stay.
      </p>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[#BF5700] px-5 py-2 font-medium text-white hover:bg-[#7a3500] disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit request"}
        </button>
        <Link
          href="/dashboard/beach-house/calendar"
          className="rounded border border-[#D6D2C4]/40 px-5 py-2 text-[#D6D2C4] hover:border-[#D6D2C4] hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
