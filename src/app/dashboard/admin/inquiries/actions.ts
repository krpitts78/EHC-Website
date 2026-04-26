"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isSiteAdmin, getCurrentMemberPerm } from "@/lib/permissions";

export async function setInquiryStatusAction(formData: FormData) {
  const perm = await getCurrentMemberPerm();
  if (!isSiteAdmin(perm)) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["pending", "reviewed", "archived"].includes(status)) return;

  const supabase = await createClient();
  await supabase
    .from("membership_inquiries")
    .update({
      status,
      reviewed_at: status === "reviewed" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  revalidatePath("/dashboard/admin/inquiries");
}
