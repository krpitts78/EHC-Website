import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { EditForm } from "./EditForm";

type Params = { slug: string };

export default async function EditPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
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
    redirect(`/dashboard/p/${slug}`);
  }

  const { data: page } = await supabase
    .from("content_pages")
    .select("title, body_markdown")
    .eq("slug", slug)
    .maybeSingle();
  if (!page) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-[#1a2128]">
      <p className="text-xs uppercase tracking-wide text-[#5a6470]/60">
        Editing /dashboard/p/{slug}
      </p>
      <h1 className="mt-1 text-3xl font-semibold">{page.title}</h1>
      <EditForm
        slug={slug}
        title={page.title}
        body_markdown={page.body_markdown}
      />
    </main>
  );
}
