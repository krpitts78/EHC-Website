import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ReservationForm,
  type MemberOption,
} from "../../ReservationForm";

type Params = Promise<{ id: string }>;

export default async function EditReservationPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [resResult, membersResult] = await Promise.all([
    supabase
      .from("reservations")
      .select(
        "id, member_id, kind, week_start_friday, end_date, is_prime, rate_cents, cleaning_fee_cents, status, deposit_paid_at, balance_paid_at, notes",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("members")
      .select("id, first_name, last_name, member_number")
      .order("last_name", { ascending: true }),
  ]);

  const r = resResult.data;
  if (!r) notFound();
  const members = (membersResult.data ?? []) as MemberOption[];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-[#1a2128]">
      <Link
        href="/dashboard/admin/reservations"
        className="text-sm text-[#BF5700] hover:underline"
      >
        ← Back to reservations
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">Edit reservation</h1>
      <ReservationForm
        mode="edit"
        members={members}
        defaults={{
          id: r.id,
          member_id: r.member_id,
          kind: r.kind,
          start_date: r.week_start_friday,
          end_date: r.end_date,
          is_prime: !!r.is_prime,
          rate_dollars: (r.rate_cents / 100).toFixed(2),
          cleaning_fee_dollars: (r.cleaning_fee_cents / 100).toFixed(2),
          status: r.status,
          deposit_paid: !!r.deposit_paid_at,
          balance_paid: !!r.balance_paid_at,
          notes: r.notes ?? "",
        }}
      />
    </main>
  );
}
