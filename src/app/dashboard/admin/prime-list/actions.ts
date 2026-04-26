"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function togglePrimeListAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";
  if (!id) return;

  const supabase = await createClient();
  await supabase
    .from("members")
    .update({ is_prime_list: next })
    .eq("id", id);

  revalidatePath("/dashboard/admin/prime-list");
}
