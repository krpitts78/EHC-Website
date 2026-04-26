import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PortalNav } from "./PortalNav";
import { EasterEggClient } from "./EasterEggClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-[#D6D2C4]">
      <PortalNav />
      {children}
      {/* Always-on Longhorn watermark, very subtle */}
      <svg
        aria-hidden
        viewBox="0 0 240 80"
        className="pointer-events-none fixed bottom-4 right-4 z-0 h-12 w-36 text-[#BF5700] opacity-[0.06] sm:h-16 sm:w-48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          {/* skull */}
          <path d="M120 35 q-14 -22 -14 6 q0 18 14 22 q14 -4 14 -22 q0 -28 -14 -6 z" />
          {/* left horn */}
          <path d="M115 42 q-30 -22 -90 -34 q40 30 90 42 z" />
          {/* right horn */}
          <path d="M125 42 q30 -22 90 -34 q-40 30 -90 42 z" />
        </g>
      </svg>
      <EasterEggClient />
    </div>
  );
}
