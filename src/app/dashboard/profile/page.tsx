import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member, error } = await supabase
    .from("members")
    .select(
      "first_name, last_name, preferred_name, suffix, spouse_name, member_number, member_type, joined_year, email, dues_amount_cents, board_role_label, is_admin, phone_home, phone_work, phone_cell, address_line1, city, state, zip",
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error || !member) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-white">
        <p className="text-red-400">
          Could not load your member profile. Contact a board member.
        </p>
      </main>
    );
  }

  const dues = member.dues_amount_cents
    ? `$${(member.dues_amount_cents / 100).toFixed(2)}`
    : "—";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-white">
      <h1 className="text-3xl font-semibold">Your profile</h1>

      <section className="mt-6 rounded-lg border border-[#4a5d3e] bg-[#2a3624] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#d4c89c]/70">
          Membership
        </h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[#d4c89c]/70">Member number</dt>
            <dd>{member.member_number}</dd>
          </div>
          <div>
            <dt className="text-[#d4c89c]/70">Joined</dt>
            <dd>{member.joined_year ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[#d4c89c]/70">Email</dt>
            <dd>{member.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[#d4c89c]/70">Annual dues</dt>
            <dd>{dues}</dd>
          </div>
          {(member.board_role_label || member.is_admin) && (
            <div className="sm:col-span-2">
              <dt className="text-[#d4c89c]/70">Role</dt>
              <dd>
                {member.board_role_label ? (
                  <span className="rounded bg-[#BF5700] px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-white">
                    {member.board_role_label}
                  </span>
                ) : (
                  <span className="rounded bg-[#4a5d3e] px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-[#d4c89c]">
                    Website Admin
                  </span>
                )}
              </dd>
            </div>
          )}
        </dl>
        <p className="mt-4 text-xs text-[#d4c89c]/60">
          To change your email or membership details, contact a board member.
        </p>
      </section>

      <ProfileForm member={member} />
    </main>
  );
}
