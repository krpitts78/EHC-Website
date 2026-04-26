"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { DOCUMENT_CATEGORIES, type DocumentCategoryId } from "./categories";

export type UploadState = { error?: string; success?: boolean };

const VALID_CATEGORIES = new Set<string>(DOCUMENT_CATEGORIES.map((c) => c.id));

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function uploadDocumentAction(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const file = formData.get("file") as File | null;

  if (!title) return { error: "Title is required." };
  if (!VALID_CATEGORIES.has(category))
    return { error: "Invalid category." };
  if (!file || file.size === 0) return { error: "Choose a file to upload." };

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const baseName = slugify(title) || "document";
  const storagePath = `${category}/${Date.now()}-${baseName}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const { error: insertError } = await supabase.from("documents").insert({
    storage_path: storagePath,
    title,
    category: category as DocumentCategoryId,
    description,
    size_bytes: file.size,
    mime_type: file.type || null,
    uploaded_by: member?.id ?? null,
  });
  if (insertError) {
    await supabase.storage.from("documents").remove([storagePath]);
    return { error: `Save failed: ${insertError.message}` };
  }

  revalidatePath("/dashboard/documents");
  return { success: true };
}

export async function deleteDocumentAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (doc?.storage_path) {
    await supabase.storage.from("documents").remove([doc.storage_path]);
  }
  await supabase.from("documents").delete().eq("id", id);

  revalidatePath("/dashboard/documents");
}
