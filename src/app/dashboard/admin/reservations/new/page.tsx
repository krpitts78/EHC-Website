import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  ReservationForm,
  type MemberOption,
} from "../ReservationForm";
import {
  CLEANING_FEE_CENTS,
  NON_PRIME_RATE_CENTS,
} from "@/lib/beach-house";

export default async function NewReservationPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("id, first_name, last_name, member_number")
    .order("last_name", { ascending: true });
  const members = (data ?? []) as MemberOption[];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-[#1a2128]">
      <Link
        href="/dashboard/admin/reservations"
        className="text-sm text-[#BF5700] hover:underline"
      >
        ← Back to reservations
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">New reservation</h1>
      <p className="mt-2 text-sm text-[#5a6470]">
        Create a reservation, block, or event on behalf of a member or the club.
        Per-member yearly limits are not enforced on this admin path.
      </p>
      <ReservationForm
        mode="create"
        members={members}
        defaults={{
          member_id: null,
          kind: "rental",
          start_date: "",
          end_date: "",
          is_prime: false,
          rate_dollars: (NON_PRIME_RATE_CENTS / 100).toFixed(2),
          cleaning_fee_dollars: (CLEANING_FEE_CENTS / 100).toFixed(2),
          status: "confirmed",
          deposit_paid: false,
          balance_paid: false,
          notes: "",
        }}
      />
    </main>
  );
}
