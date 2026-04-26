import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

type Params = { id: string };

const FALLBACK_MIME: Record<string, string> = {
  pdf: "application/pdf",
  docx:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  xlsx:
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  pptx:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

const INLINEABLE = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "text/plain",
]);

function cleanTitle(title: string): string {
  return (
    title
      // em / en dashes → hyphen
      .replace(/[–—]/g, "-")
      // forbidden filename chars
      .replace(/[\\/:*?"<>|]/g, "-")
      .trim() || "document"
  );
}

function asciiFallback(s: string): string {
  return s.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "'");
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
    .select("storage_path, title, mime_type")
    .eq("id", id)
    .maybeSingle();

  if (error || !doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = (doc.storage_path.split(".").pop() ?? "").toLowerCase();
  const mime =
    doc.mime_type || FALLBACK_MIME[ext] || "application/octet-stream";
  const filename = ext
    ? `${cleanTitle(doc.title)}.${ext}`
    : cleanTitle(doc.title);
  const dispositionType = INLINEABLE.has(mime) ? "inline" : "attachment";

  // Pull the file through the server so we control Content-Type and
  // Content-Disposition (Supabase's ?download= param doesn't reliably
  // handle non-ASCII or special chars across browsers).
  const { data: blob, error: dlErr } = await supabase.storage
    .from("documents")
    .download(doc.storage_path);

  if (dlErr || !blob) {
    return NextResponse.json(
      { error: dlErr?.message ?? "Could not fetch file" },
      { status: 500 },
    );
  }

  const buffer = await blob.arrayBuffer();
  const ascii = asciiFallback(filename);
  const encoded = encodeURIComponent(filename);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(buffer.byteLength),
      "Content-Disposition": `${dispositionType}; filename="${ascii}"; filename*=UTF-8''${encoded}`,
      "Cache-Control": "private, max-age=0, no-store",
    },
  });
}
