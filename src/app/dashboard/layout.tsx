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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        src="/longhorn.svg"
        alt=""
        className="pointer-events-none fixed bottom-4 right-4 z-0 h-20 w-auto opacity-[0.04] sm:h-28"
      />
      <EasterEggClient />
    </div>
  );
}
