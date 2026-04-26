import { createClient } from "@/lib/supabase/server";
import { isSiteAdmin, getCurrentMemberPerm } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { setInquiryStatusAction } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  reviewed: "Reviewed",
  archived: "Archived",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-[#BF5700]/20 text-[#F8971F]",
  reviewed: "bg-blue-900/30 text-blue-200",
  archived: "bg-[#4a5d3e] text-[#d4c89c]/70",
};

export default async function InquiriesPage() {
  const perm = await getCurrentMemberPerm();
  if (!perm) redirect("/login");
  if (!isSiteAdmin(perm)) redirect("/dashboard");

  const supabase = await createClient();
  const { data: inquiries } = await supabase
    .from("membership_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 text-white">
      <h1 className="text-3xl font-semibold">Membership inquiries</h1>
      <p className="mt-2 text-sm text-[#d4c89c]">
        Submissions from the public site&apos;s inquiry form.
      </p>

      {(!inquiries || inquiries.length === 0) && (
        <p className="mt-12 text-[#d4c89c]/70">No inquiries yet.</p>
      )}

      <div className="mt-6 space-y-3">
        {(inquiries ?? []).map((q) => (
          <article
            key={q.id}
            className="rounded-lg border border-[#4a5d3e] bg-[#2a3624] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-medium">{q.full_name}</h2>
                <p className="text-xs text-[#d4c89c]/70">
                  <a
                    className="text-[#F8971F] hover:underline"
                    href={`mailto:${q.email}`}
                  >
                    {q.email}
                  </a>
                  {q.phone && (
                    <>
                      {" · "}
                      <a className="hover:underline" href={`tel:${q.phone}`}>
                        {q.phone}
                      </a>
                    </>
                  )}
                  {q.sponsor_name && (
                    <> · sponsor: <span className="text-white">{q.sponsor_name}</span></>
                  )}
                </p>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${
                  STATUS_BADGE[q.status]
                }`}
              >
                {STATUS_LABEL[q.status]}
              </span>
            </div>

            {q.message && (
              <p className="mt-3 whitespace-pre-wrap rounded border border-[#4a5d3e] bg-[#1d2a1d] px-3 py-2 text-sm text-[#d4c89c]">
                {q.message}
              </p>
            )}

            <p className="mt-2 text-xs text-[#d4c89c]/60">
              Submitted {new Date(q.created_at).toLocaleString()}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {q.status !== "reviewed" && (
                <form action={setInquiryStatusAction}>
                  <input type="hidden" name="id" value={q.id} />
                  <input type="hidden" name="status" value="reviewed" />
                  <button
                    type="submit"
                    className="rounded border border-blue-500/60 px-3 py-1 text-xs text-blue-200 hover:bg-blue-900/30"
                  >
                    Mark reviewed
                  </button>
                </form>
              )}
              {q.status !== "archived" && (
                <form action={setInquiryStatusAction}>
                  <input type="hidden" name="id" value={q.id} />
                  <input type="hidden" name="status" value="archived" />
                  <button
                    type="submit"
                    className="rounded border border-[#d4c89c]/40 px-3 py-1 text-xs text-[#d4c89c] hover:border-[#d4c89c] hover:text-white"
                  >
                    Archive
                  </button>
                </form>
              )}
              {q.status !== "pending" && (
                <form action={setInquiryStatusAction}>
                  <input type="hidden" name="id" value={q.id} />
                  <input type="hidden" name="status" value="pending" />
                  <button
                    type="submit"
                    className="rounded border border-[#BF5700]/60 px-3 py-1 text-xs text-[#F8971F] hover:bg-[#BF5700]/20"
                  >
                    Reopen
                  </button>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
