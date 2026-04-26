"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type EditState = { error?: string };

export async function savePageAction(
  _prev: EditState,
  formData: FormData,
): Promise<EditState> {
  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body_markdown") ?? "");
  if (!slug) return { error: "Missing slug." };
  if (!title) return { error: "Title is required." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const { error } = await supabase
    .from("content_pages")
    .update({ title, body_markdown: body, updated_by: member?.id ?? null })
    .eq("slug", slug);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/p/${slug}`);
  redirect(`/dashboard/p/${slug}`);
}
