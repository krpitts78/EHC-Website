import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PortalNav } from "./PortalNav";

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
    <div className="flex min-h-full flex-1 flex-col bg-[#D6D2C4]">
      <PortalNav />
      {children}
    </div>
  );
}
