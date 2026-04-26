"use client";

import { useActionState } from "react";
import { submitInquiryAction, type InquiryState } from "./actions";

const initial: InquiryState = {};

export function InquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitInquiryAction,
    initial,
  );

  if (state.success) {
    return (
      <div className="rounded-lg border border-green-700/40 bg-green-900/20 px-6 py-8 text-center">
        <p className="text-lg font-medium text-green-200">
          Thanks — we&apos;ve received your inquiry.
        </p>
        <p className="mt-2 text-sm text-[#D6D2C4]">
          A board member will be in touch. If you have a sponsor in the club,
          let them know to expect a question or two.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot — hidden from real users, bots fill it. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="full_name" required />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Field label="Phone (optional)" name="phone" type="tel" />
        <Field
          label="Sponsoring EHC member (if you have one)"
          name="sponsor_name"
        />
      </div>

      <label className="block text-sm">
        <span className="text-[#D6D2C4]">Message (optional)</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us a bit about yourself, who you know in the club, and your hunting/fishing background."
          className="mt-1 w-full rounded border border-[#333F48] bg-[#222b33] px-3 py-2 text-white focus:border-[#BF5700] focus:outline-none"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-[#BF5700] px-6 py-2.5 font-medium text-white hover:bg-[#7a3500] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Submit inquiry"}
      </button>

      <p className="text-xs text-[#D6D2C4]/60">
        Per the club&apos;s bylaws, prospective members must be proposed by one
        member and seconded by another. The Board reviews each proposal.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-[#D6D2C4]">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded border border-[#333F48] bg-[#222b33] px-3 py-2 text-white focus:border-[#BF5700] focus:outline-none"
      />
    </label>
  );
}
