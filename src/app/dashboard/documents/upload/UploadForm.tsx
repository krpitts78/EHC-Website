"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { uploadDocumentAction, type UploadState } from "../actions";
import { DOCUMENT_CATEGORIES } from "../categories";

const initial: UploadState = {};

export function UploadForm() {
  const [state, formAction, pending] = useActionState(
    uploadDocumentAction,
    initial,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => router.push("/dashboard/documents"), 600);
      return () => clearTimeout(t);
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <label className="block text-sm">
        <span className="text-[#5a6470]">Title</span>
        <input
          name="title"
          required
          placeholder="e.g. Bylaws (revised 2024)"
          className="mt-1 w-full rounded border border-[#a8a395] bg-white px-3 py-2 text-[#1a2128] focus:border-[#BF5700] focus:outline-none"
        />
      </label>

      <label className="block text-sm">
        <span className="text-[#5a6470]">Category</span>
        <select
          name="category"
          required
          defaultValue=""
          className="mt-1 w-full rounded border border-[#a8a395] bg-white px-3 py-2 text-[#1a2128] focus:border-[#BF5700] focus:outline-none"
        >
          <option value="" disabled>
            Choose…
          </option>
          {DOCUMENT_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-[#5a6470]">Description (optional)</span>
        <textarea
          name="description"
          rows={3}
          className="mt-1 w-full rounded border border-[#a8a395] bg-white px-3 py-2 text-[#1a2128] focus:border-[#BF5700] focus:outline-none"
        />
      </label>

      <label className="block text-sm">
        <span className="text-[#5a6470]">File</span>
        <input
          type="file"
          name="file"
          required
          className="mt-1 block w-full text-sm text-[#5a6470] file:mr-4 file:rounded file:border-0 file:bg-[#BF5700] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#7a3500]"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-green-400">
          Uploaded. Redirecting…
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-[#BF5700] px-5 py-2 font-medium text-white hover:bg-[#7a3500] disabled:opacity-60"
      >
        {pending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
