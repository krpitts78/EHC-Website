"use client";

import Image from "next/image";
import Link from "next/link";

const WINDOW_MS = 1500;

export function LogoLink() {
  function onClick() {
    if (typeof window === "undefined") return;
    const now = Date.now();
    const last = parseInt(localStorage.getItem("logoClickTs") ?? "0", 10);
    const count = parseInt(localStorage.getItem("logoClickCount") ?? "0", 10);
    const next = now - last < WINDOW_MS ? count + 1 : 1;
    localStorage.setItem("logoClickTs", String(now));
    localStorage.setItem("logoClickCount", String(next));
    if (next >= 3) {
      const wasOn = localStorage.getItem("utReveal") === "1";
      localStorage.setItem("utReveal", wasOn ? "0" : "1");
      localStorage.setItem("logoClickCount", "0");
      window.dispatchEvent(new Event("ut-reveal-changed"));
    }
  }

  return (
    <Link
      href="/dashboard"
      onClick={onClick}
      className="flex items-center gap-3 select-none"
    >
      <Image
        src="/logo.png"
        alt="EHC"
        width={36}
        height={36}
        className="brightness-0 invert"
      />
      <span className="text-sm font-semibold uppercase tracking-wider text-white sm:tracking-wide">
        <span className="hidden sm:inline">Executive Hunting Club</span>
        <span className="sm:hidden">EHC</span>
      </span>
    </Link>
  );
}
