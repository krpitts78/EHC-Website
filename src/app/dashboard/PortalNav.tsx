import Image from "next/image";
import Link from "next/link";

export function PortalNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#333F48] bg-[#1a2128] text-[#D6D2C4]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="EHC"
            width={36}
            height={36}
            className="rounded"
          />
          <span className="text-sm font-semibold uppercase tracking-wider text-white">
            Executive Hunting Club
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/dashboard/directory" className="hover:text-white">
            Directory
          </Link>
          <Link href="/dashboard/beach-house" className="hover:text-white">
            Beach House
          </Link>
          <Link href="/dashboard/documents" className="hover:text-white">
            Documents
          </Link>
          <Link href="/dashboard/p/bylaws" className="hover:text-white">
            Bylaws
          </Link>
          <Link href="/dashboard/profile" className="hover:text-white">
            Profile
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded border border-[#D6D2C4]/40 px-3 py-1 text-xs hover:border-[#D6D2C4] hover:text-white"
            >
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
