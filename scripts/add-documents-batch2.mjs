// One-shot: add 6 more documents from the user's Drive.
// Run: node scripts/add-documents-batch2.mjs
import { readFile, stat } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { createClient } from "@supabase/supabase-js";

const SOURCE_DIR = "G:/My Drive/EHC Documents";

const DOCS = [
  {
    file: "Minutes 2_13_26.docx",
    category: "board_minutes",
    title: "Board Minutes — 2/13/2026",
  },
  {
    file: "New Member Application Form for Waiting List 2026.docx",
    category: "other",
    title: "New Member Application Form (Waiting List 2026)",
  },
  {
    file: "New Member Information Sheet 2026.docx",
    category: "other",
    title: "New Member Information Sheet 2026",
  },
  {
    file: "Opinion Letter 05-12-2009.pdf",
    category: "other",
    title: "Legal Opinion Letter (May 12, 2009)",
  },
  {
    file: "Prime Time List 2026.pdf",
    category: "other",
    title: "Prime Time List 2026",
  },
  {
    file: "tax returm 2024.pdf",
    category: "tax_returns",
    title: "2024 Tax Return",
  },
];

const MIME_BY_EXT = {
  ".pdf": "application/pdf",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

async function loadEnv() {
  const env = {};
  const txt = await readFile(".env.local", "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const env = await loadEnv();
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  for (const doc of DOCS) {
    const sourcePath = resolve(SOURCE_DIR, doc.file);
    let bytes;
    try {
      bytes = await readFile(sourcePath);
    } catch (e) {
      console.error(`SKIP ${doc.file}: ${e.message}`);
      continue;
    }
    const sizeBytes = (await stat(sourcePath)).size;
    const ext = extname(doc.file).toLowerCase();
    const mimeType = MIME_BY_EXT[ext] ?? "application/octet-stream";
    const storagePath = `${doc.category}/${Date.now()}-${slugify(doc.title)}${ext}`;

    process.stdout.write(
      `Uploading ${doc.title} (${(sizeBytes / 1024).toFixed(0)} KB)... `,
    );
    const { error: upErr } = await supabase.storage
      .from("documents")
      .upload(storagePath, bytes, {
        contentType: mimeType,
        upsert: false,
      });
    if (upErr) {
      console.error(`FAILED upload: ${upErr.message}`);
      continue;
    }

    const { error: insErr } = await supabase.from("documents").insert({
      storage_path: storagePath,
      title: doc.title,
      category: doc.category,
      size_bytes: sizeBytes,
      mime_type: mimeType,
    });
    if (insErr) {
      console.error(`FAILED metadata: ${insErr.message}`);
      await supabase.storage.from("documents").remove([storagePath]);
      continue;
    }
    console.log("OK");
  }

  const { data } = await supabase
    .from("documents")
    .select("category, title")
    .order("category");
  console.log(`\nDocuments now in DB: ${data.length}`);
  for (const d of data) console.log(`  [${d.category}] ${d.title}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
