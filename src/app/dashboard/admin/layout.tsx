import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("members")
    .select("is_admin, board_role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!member?.is_admin && !member?.board_role) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="border-b border-[#333F48] bg-[#0f1419]">
        <div className="mx-auto flex max-w-6xl gap-4 px-4 py-2 text-xs uppercase tracking-wide text-[#D6D2C4]">
          <span className="text-[#F8971F]">Admin</span>
          <Link href="/dashboard/admin/reservations" className="hover:text-white">
            Reservations
          </Link>
          <Link href="/dashboard/admin/prime-list" className="hover:text-white">
            Prime list
          </Link>
        </div>
      </div>
      {children}
    </>
  );
}
