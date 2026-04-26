"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type SignupState } from "./actions";

const initialState: SignupState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    signupAction,
    initialState,
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#1a2128] px-6 py-16">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-[#1a2128]">Create account</h1>
        <p className="mt-2 text-sm text-[#333F48]">
          Use the email address on file with the club.
        </p>

        <label className="mt-6 block text-sm font-medium text-[#333F48]">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded border border-[#D6D2C4] bg-white px-3 py-2 text-[#1a2128] focus:border-[#BF5700] focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-[#333F48]">
          Password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded border border-[#D6D2C4] bg-white px-3 py-2 text-[#1a2128] focus:border-[#BF5700] focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-[#333F48]">
          Confirm password
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded border border-[#D6D2C4] bg-white px-3 py-2 text-[#1a2128] focus:border-[#BF5700] focus:outline-none"
          />
        </label>

        {state.error && (
          <p className="mt-4 text-sm text-red-700">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded bg-[#BF5700] px-4 py-2 font-medium text-white hover:bg-[#7a3500] disabled:opacity-60"
        >
          {pending ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-4 text-center text-sm text-[#333F48]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#BF5700] hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
