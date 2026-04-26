import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: member } = await supabase
    .from("members")
    .select("first_name, last_name, member_number, board_role_label, is_admin")
    .eq("auth_user_id", user!.id)
    .maybeSingle();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 text-white">
      <h1 className="text-3xl font-semibold">
        Welcome{member ? `, ${member.first_name}` : ""}
      </h1>
      {member && (
        <p className="mt-2 text-[#D6D2C4]">
          {member.first_name} {member.last_name} &middot; Member{" "}
          {member.member_number}
          {member.board_role_label ? (
            <span className="ml-2 rounded bg-[#BF5700] px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-white">
              {member.board_role_label}
            </span>
          ) : member.is_admin ? (
            <span className="ml-2 rounded bg-[#333F48] px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-[#D6D2C4]">
              Website Admin
            </span>
          ) : null}
        </p>
      )}

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/directory"
          className="rounded-lg border border-[#333F48] bg-[#222b33] p-6 hover:border-[#BF5700]"
        >
          <h2 className="text-lg font-medium text-white">Member directory</h2>
          <p className="mt-1 text-sm text-[#D6D2C4]">
            Browse all members and the current board.
          </p>
        </Link>
        <Link
          href="/dashboard/documents"
          className="rounded-lg border border-[#333F48] bg-[#222b33] p-6 hover:border-[#BF5700]"
        >
          <h2 className="text-lg font-medium text-white">Documents</h2>
          <p className="mt-1 text-sm text-[#D6D2C4]">
            Bylaws, financials, board minutes, beach house references.
          </p>
        </Link>
        <Link
          href="/dashboard/profile"
          className="rounded-lg border border-[#333F48] bg-[#222b33] p-6 hover:border-[#BF5700]"
        >
          <h2 className="text-lg font-medium text-white">Your profile</h2>
          <p className="mt-1 text-sm text-[#D6D2C4]">
            Update your contact info, spouse, and address.
          </p>
        </Link>
      </div>
    </main>
  );
}
