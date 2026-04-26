import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";

type Params = { slug: string };

export default async function ContentPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: page } = await supabase
    .from("content_pages")
    .select("title, body_markdown, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (!page) notFound();

  const { data: member } = await supabase
    .from("members")
    .select("is_admin, board_role")
    .eq("auth_user_id", user!.id)
    .maybeSingle();
  const canEdit = !!(member?.is_admin || member?.board_role);

  const html = await marked.parse(page.body_markdown || "_(empty)_", {
    breaks: true,
    gfm: true,
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-[#1a2128]">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold">{page.title}</h1>
        {canEdit && (
          <Link
            href={`/dashboard/p/${slug}/edit`}
            className="rounded border border-[#d4c89c]/40 px-3 py-1 text-xs text-[#5a6470] hover:border-[#d4c89c] hover:text-[#1a2128]"
          >
            Edit
          </Link>
        )}
      </div>
      <article
        className="prose mt-8 max-w-none prose-headings:text-[#1a2128] prose-a:text-[#BF5700] prose-strong:text-[#1a2128]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
