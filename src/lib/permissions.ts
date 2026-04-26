import { createClient } from "@/lib/supabase/server";

type MemberPerm = {
  is_admin: boolean | null;
  board_role: string | null;
};

export function canManageBeachHouse(m: MemberPerm | null | undefined): boolean {
  if (!m) return false;
  return !!m.is_admin || m.board_role === "vp_beach_house";
}

export function isSiteAdmin(m: MemberPerm | null | undefined): boolean {
  if (!m) return false;
  return !!m.is_admin || !!m.board_role;
}

/**
 * Convenience: load current user's permissions.
 * Returns null if not signed in or no member record.
 */
export async function getCurrentMemberPerm(): Promise<MemberPerm | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("members")
    .select("is_admin, board_role")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  return data ?? null;
}
