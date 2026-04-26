"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileState = { error?: string; success?: boolean };

const FIELDS = [
  "first_name",
  "last_name",
  "preferred_name",
  "suffix",
  "spouse_name",
  "phone_home",
  "phone_work",
  "phone_cell",
  "address_line1",
  "city",
  "state",
  "zip",
] as const;

function clean(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const update: Record<string, string | null> = {};
  for (const field of FIELDS) update[field] = clean(formData.get(field));

  if (!update.first_name || !update.last_name) {
    return { error: "First and last name are required." };
  }

  const { error } = await supabase
    .from("members")
    .update(update)
    .eq("auth_user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/directory");
  revalidatePath("/dashboard");
  return { success: true };
}
