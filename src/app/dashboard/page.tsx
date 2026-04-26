import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: member } = await supabase
    .from("members")
    .select("first_name, last_name, member_number, board_role_label")
    .eq("auth_user_id", user!.id)
    .maybeSingle();

  return (
    <main className="flex flex-1 flex-col bg-[#1a2128] px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-semibold">
          Welcome{member ? `, ${member.first_name}` : ""}
        </h1>
        {member && (
          <p className="mt-2 text-[#D6D2C4]">
            {member.first_name} {member.last_name} &middot; Member{" "}
            {member.member_number}
            {member.board_role_label && (
              <span className="ml-2 rounded bg-[#BF5700] px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-white">
                {member.board_role_label}
              </span>
            )}
          </p>
        )}

        <p className="mt-12 text-[#D6D2C4]">
          Member portal coming soon. Directory, beach house reservations, events,
          and documents will land here.
        </p>

        <form action="/auth/signout" method="post" className="mt-8">
          <button
            type="submit"
            className="rounded border border-[#D6D2C4] px-4 py-2 text-sm font-medium text-[#D6D2C4] hover:bg-[#D6D2C4] hover:text-[#1a2128]"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
