import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DOCUMENT_CATEGORIES, categoryLabel } from "./categories";
import { deleteDocumentAction } from "./actions";

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function DocumentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: member } = await supabase
    .from("members")
    .select("is_admin, board_role")
    .eq("auth_user_id", user!.id)
    .maybeSingle();
  const canManage = !!(member?.is_admin || member?.board_role);

  const { data: documents } = await supabase
    .from("documents")
    .select("id, title, category, description, size_bytes, created_at")
    .order("created_at", { ascending: false });

  const byCategory = new Map<string, typeof documents>();
  for (const doc of documents ?? []) {
    const list = byCategory.get(doc.category) ?? [];
    list.push(doc);
    byCategory.set(doc.category, list);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 text-[#1a2128]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Documents</h1>
          <p className="mt-2 text-sm text-[#5a6470]">
            Bylaws, financials, board minutes, and beach house references.
          </p>
        </div>
        {canManage && (
          <Link
            href="/dashboard/documents/upload"
            className="rounded bg-[#BF5700] px-4 py-2 text-sm font-medium text-white hover:bg-[#7a3500]"
          >
            Upload
          </Link>
        )}
      </div>

      {(!documents || documents.length === 0) && (
        <p className="mt-12 text-[#5a6470]/70">
          No documents yet.
          {canManage ? " Upload one to get started." : ""}
        </p>
      )}

      <div className="mt-8 space-y-10">
        {DOCUMENT_CATEGORIES.map((cat) => {
          const list = byCategory.get(cat.id) ?? [];
          if (list.length === 0) return null;
          return (
            <section key={cat.id}>
              <h2 className="text-lg font-semibold text-[#5a6470]">
                {cat.label}
              </h2>
              <ul className="mt-3 divide-y divide-[#a8a395] rounded-lg border border-[#a8a395] bg-white">
                {list.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-4 px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <a
                        href={`/dashboard/documents/${doc.id}/download`}
                        target="_blank"
                        rel="noopener"
                        className="font-medium text-[#1a2128] hover:text-[#BF5700]"
                      >
                        {doc.title}
                      </a>
                      {doc.description && (
                        <p className="mt-0.5 text-xs text-[#5a6470]/70 truncate">
                          {doc.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-[#5a6470]/60">
                      {formatSize(doc.size_bytes)}
                    </span>
                    {canManage && (
                      <form action={deleteDocumentAction}>
                        <input type="hidden" name="id" value={doc.id} />
                        <button
                          type="submit"
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {documents && documents.length > 0 && byCategory.size === 0 && (
        <p className="mt-8 text-sm text-[#5a6470]/70">
          {documents.length} document(s) — none in known categories.
        </p>
      )}

      <p className="sr-only">{categoryLabel("other")}</p>
    </main>
  );
}
