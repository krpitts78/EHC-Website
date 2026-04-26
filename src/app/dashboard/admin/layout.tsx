import { redirect } from "next/navigation";
import Link from "next/link";
import { canManageBeachHouse, getCurrentMemberPerm } from "@/lib/permissions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const perm = await getCurrentMemberPerm();
  if (!perm) redirect("/login");
  if (!canManageBeachHouse(perm)) redirect("/dashboard");

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
