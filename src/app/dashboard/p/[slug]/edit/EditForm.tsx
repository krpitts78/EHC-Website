"use client";

import { useActionState } from "react";
import Link from "next/link";
import { savePageAction, type EditState } from "./actions";

const initial: EditState = {};

export function EditForm({
  slug,
  title,
  body_markdown,
}: {
  slug: string;
  title: string;
  body_markdown: string;
}) {
  const [state, formAction, pending] = useActionState(
    savePageAction,
    initial,
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="slug" value={slug} />

      <label className="block text-sm">
        <span className="text-[#D6D2C4]">Title</span>
        <input
          name="title"
          defaultValue={title}
          required
          className="mt-1 w-full rounded border border-[#333F48] bg-[#222b33] px-3 py-2 text-white focus:border-[#BF5700] focus:outline-none"
        />
      </label>

      <label className="block text-sm">
        <span className="text-[#D6D2C4]">
          Body (Markdown — # heading, **bold**, * bullet, [link](https://…))
        </span>
        <textarea
          name="body_markdown"
          defaultValue={body_markdown}
          rows={28}
          className="mt-1 w-full rounded border border-[#333F48] bg-[#222b33] px-3 py-2 font-mono text-sm text-white focus:border-[#BF5700] focus:outline-none"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[#BF5700] px-5 py-2 font-medium text-white hover:bg-[#7a3500] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <Link
          href={`/dashboard/p/${slug}`}
          className="rounded border border-[#D6D2C4]/40 px-5 py-2 text-[#D6D2C4] hover:border-[#D6D2C4] hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
