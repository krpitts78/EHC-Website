import { redirect } from "next/navigation";
import Link from "next/link";
import {
  canManageBeachHouse,
  getCurrentMemberPerm,
  isSiteAdmin,
} from "@/lib/permissions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const perm = await getCurrentMemberPerm();
  if (!perm) redirect("/login");
  // Layout-level: require beach-house admin OR any board/admin (which all
  // current admin pages need at minimum).
  if (!canManageBeachHouse(perm) && !isSiteAdmin(perm)) redirect("/dashboard");

  const showBeachHouse = canManageBeachHouse(perm);

  return (
    <>
      <div className="border-b border-[#5a6470] bg-[#1a2128]">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 py-2 text-xs uppercase tracking-wide text-[#d4c89c]">
          <span className="text-[#BF5700]">Admin</span>
          {showBeachHouse && (
            <>
              <Link
                href="/dashboard/admin/reservations"
                className="hover:text-white"
              >
                Reservations
              </Link>
              <Link
                href="/dashboard/admin/prime-list"
                className="hover:text-white"
              >
                Prime list
              </Link>
            </>
          )}
        </div>
      </div>
      {children}
    </>
  );
}
