import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

type Params = { id: string };

function safeName(title: string): string {
  return title.replace(/[\\/:*?"<>|]/g, "-").trim() || "document";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: doc, error } = await supabase
    .from("documents")
    .select("storage_path, title")
    .eq("id", id)
    .maybeSingle();

  if (error || !doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Pull extension off the stored object key (we always upload with one).
  const ext = (doc.storage_path.split(".").pop() ?? "").toLowerCase();
  const filename = ext ? `${safeName(doc.title)}.${ext}` : safeName(doc.title);
  const isInlineable = ext === "pdf";

  // For PDFs, leave Content-Disposition off so the browser can preview;
  // for other types (docx, xlsx, etc.) force an attachment with the right name.
  const { data: signed, error: signErr } = await supabase.storage
    .from("documents")
    .createSignedUrl(
      doc.storage_path,
      60,
      isInlineable ? undefined : { download: filename },
    );

  if (signErr || !signed) {
    return NextResponse.json(
      { error: signErr?.message ?? "Could not sign URL" },
      { status: 500 },
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}
