import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UploadForm } from "./UploadForm";

export default async function UploadPage() {
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
    redirect("/dashboard/documents");
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 text-white">
      <h1 className="text-3xl font-semibold">Upload document</h1>
      <p className="mt-2 text-sm text-[#d4c89c]">
        Visible to all signed-in members. PDF, DOCX, etc. — up to 25 MB.
      </p>
      <UploadForm />
    </main>
  );
}
