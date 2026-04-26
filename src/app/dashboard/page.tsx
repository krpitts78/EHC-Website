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
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 text-[#1a2128]">
      <h1 className="text-3xl font-semibold">
        Welcome{member ? `, ${member.first_name}` : ""}
      </h1>
      {member && (
        <p className="mt-2 text-[#5a6470]">
          {member.first_name} {member.last_name} &middot; Member{" "}
          {member.member_number}
          {member.board_role_label ? (
            <span className="ml-2 rounded bg-[#BF5700] px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-white">
              {member.board_role_label}
            </span>
          ) : member.is_admin ? (
            <span className="ml-2 rounded bg-[#5a6470] px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-white">
              Website Admin
            </span>
          ) : null}
        </p>
      )}

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/directory"
          className="rounded-lg border border-[#a8a395] bg-white p-6 hover:border-[#BF5700]"
        >
          <h2 className="text-lg font-medium text-[#1a2128]">Member directory</h2>
          <p className="mt-1 text-sm text-[#5a6470]">
            Browse all members and the current board.
          </p>
        </Link>
        <Link
          href="/dashboard/beach-house"
          className="rounded-lg border border-[#a8a395] bg-white p-6 hover:border-[#BF5700]"
        >
          <h2 className="text-lg font-medium text-[#1a2128]">Beach House</h2>
          <p className="mt-1 text-sm text-[#5a6470]">
            Rules, contact information, and (soon) reservation calendar.
          </p>
        </Link>
        <Link
          href="/dashboard/documents"
          className="rounded-lg border border-[#a8a395] bg-white p-6 hover:border-[#BF5700]"
        >
          <h2 className="text-lg font-medium text-[#1a2128]">Documents</h2>
          <p className="mt-1 text-sm text-[#5a6470]">
            Tax returns, financial statements, articles of incorporation.
          </p>
        </Link>
        <Link
          href="/dashboard/p/bylaws"
          className="rounded-lg border border-[#a8a395] bg-white p-6 hover:border-[#BF5700]"
        >
          <h2 className="text-lg font-medium text-[#1a2128]">Bylaws</h2>
          <p className="mt-1 text-sm text-[#5a6470]">
            The club&apos;s governing document.
          </p>
        </Link>
        <Link
          href="/dashboard/p/payment-instructions"
          className="rounded-lg border border-[#a8a395] bg-white p-6 hover:border-[#BF5700]"
        >
          <h2 className="text-lg font-medium text-[#1a2128]">Payment instructions</h2>
          <p className="mt-1 text-sm text-[#5a6470]">
            How to pay dues, beach house fees, and event fees by Zelle or check.
          </p>
        </Link>
        <Link
          href="/dashboard/profile"
          className="rounded-lg border border-[#a8a395] bg-white p-6 hover:border-[#BF5700]"
        >
          <h2 className="text-lg font-medium text-[#1a2128]">Your profile</h2>
          <p className="mt-1 text-sm text-[#5a6470]">
            Update your contact info, spouse, and address.
          </p>
        </Link>
      </div>
    </main>
  );
}
