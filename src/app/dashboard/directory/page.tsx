import { createClient } from "@/lib/supabase/server";
import { DirectoryList, type DirectoryMember } from "./DirectoryList";

const BOARD_ROLE_RANK: Record<string, number> = {
  president: 1,
  vp_beach_house: 2,
  vp_legal: 3,
  vp_membership: 4,
  vp_secretary_treasurer: 5,
  director: 6,
};

export default async function DirectoryPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      "id, first_name, last_name, preferred_name, suffix, spouse_name, member_number, board_role, board_role_label, is_admin, email, phone_home, phone_work, phone_cell, address_line1, city, state, zip, joined_year",
    );

  if (error) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 text-[#1a2128]">
        <p className="text-red-400">Could not load directory: {error.message}</p>
      </main>
    );
  }

  const members = (data ?? []) as DirectoryMember[];

  const board = members
    .filter((m) => m.board_role)
    .sort((a, b) => {
      const ra = BOARD_ROLE_RANK[a.board_role!] ?? 99;
      const rb = BOARD_ROLE_RANK[b.board_role!] ?? 99;
      if (ra !== rb) return ra - rb;
      return a.last_name.localeCompare(b.last_name);
    });

  const everyone = [...members].sort(
    (a, b) =>
      a.last_name.localeCompare(b.last_name) ||
      a.first_name.localeCompare(b.first_name),
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 text-[#1a2128]">
      <h1 className="text-3xl font-semibold">Membership Directory</h1>
      <p className="mt-2 text-sm text-[#5a6470]">
        {members.length} members &middot; {board.length} board
      </p>
      <DirectoryList board={board} everyone={everyone} />
    </main>
  );
}
