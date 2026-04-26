"use client";

import Link from "next/link";
import { useState } from "react";

type Item = { href: string; label: string; accent?: boolean };

export function NavMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <nav className="hidden items-center gap-4 text-sm md:flex">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={
              it.accent
                ? "text-[#BF5700] hover:text-white"
                : "hover:text-white"
            }
          >
            {it.label}
          </Link>
        ))}
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded border border-[#d4c89c]/40 px-3 py-1 text-xs hover:border-[#d4c89c] hover:text-white"
          >
            Sign out
          </button>
        </form>
      </nav>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
        aria-expanded={open}
        className="rounded border border-[#d4c89c]/40 p-2 md:hidden"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {open ? (
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-[#5a6470] bg-[#333F48] shadow-lg md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className={`block rounded px-2 py-2 text-sm ${
                  it.accent
                    ? "text-[#BF5700] hover:bg-[#4a5763]"
                    : "hover:bg-[#4a5763] hover:text-white"
                }`}
              >
                {it.label}
              </Link>
            ))}
            <form action="/auth/signout" method="post" className="mt-2">
              <button
                type="submit"
                className="w-full rounded border border-[#d4c89c]/40 px-3 py-2 text-sm hover:border-[#d4c89c] hover:text-white"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      )}
    </>
  );
}
