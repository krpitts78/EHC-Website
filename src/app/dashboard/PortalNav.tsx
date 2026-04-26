import Image from "next/image";
import Link from "next/link";
import {
  canManageBeachHouse,
  getCurrentMemberPerm,
  isSiteAdmin,
} from "@/lib/permissions";
import { NavMenu } from "./NavMenu";

export async function PortalNav() {
  const perm = await getCurrentMemberPerm();
  const showAdmin = canManageBeachHouse(perm) || isSiteAdmin(perm);

  const items = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/directory", label: "Directory" },
    { href: "/dashboard/beach-house", label: "Beach House" },
    { href: "/dashboard/documents", label: "Documents" },
    { href: "/dashboard/p/bylaws", label: "Bylaws" },
    { href: "/dashboard/profile", label: "Profile" },
    ...(showAdmin
      ? [
          {
            href: canManageBeachHouse(perm)
              ? "/dashboard/admin/reservations"
              : "/dashboard/admin/inquiries",
            label: "Admin",
            accent: true,
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-[#5a6470] bg-[#333F48] text-[#d4c89c]">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="EHC"
            width={36}
            height={36}
            className="brightness-0 invert"
          />
          <span className="text-sm font-semibold uppercase tracking-wider text-white sm:tracking-wide">
            <span className="hidden sm:inline">Executive Hunting Club</span>
            <span className="sm:hidden">EHC</span>
          </span>
        </Link>
        <NavMenu items={items} />
      </div>
    </header>
  );
}
