// One-shot seed: uploads source PDFs from the user's Google Drive into the
// "documents" Supabase Storage bucket and inserts metadata rows.
//
// Run with: node scripts/seed-documents.mjs
//
// Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.

import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const ENV_PATH = ".env.local";
const SOURCE_DIR = "G:/My Drive/EHC Documents";

const DOCS = [
  {
    file: "Articles of Incorporation EHC.pdf",
    category: "articles",
    title: "Articles of Incorporation",
    description: null,
  },
  {
    file: "2022_EHC_Form990-EZ_final return.pdf",
    category: "tax_returns",
    title: "2022 Form 990-EZ",
    description: null,
  },
  {
    file: "2024 Form 990T tax _final.pdf",
    category: "tax_returns",
    title: "2024 Form 990-T",
    description: null,
  },
  {
    file: "Financial Statements 2023.pdf",
    category: "financial_statements",
    title: "Financial Statements 2023",
    description: null,
  },
  {
    file: "Financial Statements 2024_BW.pdf",
    category: "financial_statements",
    title: "Financial Statements 2024",
    description: null,
  },
  {
    file: "financial-stmts-ending-2025.pdf",
    category: "financial_statements",
    title: "Financial Statements 2025",
    description: null,
  },
];

function loadEnv(path) {
  return readFile(path, "utf8").then((txt) => {
    const env = {};
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2];
    }
    return env;
  });
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const env = await loadEnv(ENV_PATH);
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

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
    const storagePath = `${doc.category}/${Date.now()}-${slugify(doc.title)}.pdf`;

    process.stdout.write(`Uploading ${doc.title} (${(sizeBytes / 1024).toFixed(0)} KB)... `);
    const { error: upErr } = await supabase.storage
      .from("documents")
      .upload(storagePath, bytes, {
        contentType: "application/pdf",
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
      description: doc.description,
      size_bytes: sizeBytes,
      mime_type: "application/pdf",
    });
    if (insErr) {
      console.error(`FAILED metadata: ${insErr.message}`);
      await supabase.storage.from("documents").remove([storagePath]);
      continue;
    }
    console.log("OK");
  }

  const { data, error } = await supabase.from("documents").select("category, title").order("category");
  if (!error) {
    console.log(`\nDocuments now in DB: ${data.length}`);
    for (const d of data) console.log(`  [${d.category}] ${d.title}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
