"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#1d2a1d] px-6 py-16">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-[#1d2a1d]">Log in</h1>

        <label className="mt-6 block text-sm font-medium text-[#4a5d3e]">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded border border-[#d4c89c] bg-white px-3 py-2 text-[#1d2a1d] focus:border-[#BF5700] focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-[#4a5d3e]">
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded border border-[#d4c89c] bg-white px-3 py-2 text-[#1d2a1d] focus:border-[#BF5700] focus:outline-none"
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
          {pending ? "Logging in..." : "Log in"}
        </button>

        <p className="mt-4 text-center text-sm text-[#4a5d3e]">
          New member?{" "}
          <Link href="/signup" className="text-[#BF5700] hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
