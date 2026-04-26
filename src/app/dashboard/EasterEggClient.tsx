"use client";

import { useEffect, useRef, useState } from "react";

const TEXAS = "texas";

/**
 * Client-side easter eggs:
 *   - Type "texas" anywhere → full-screen "HOOK 'EM!" flash
 *   - Triple-click the EHC logo (handled in LogoLink) toggles
 *     localStorage `utReveal` and dispatches `ut-reveal-changed`.
 *     This component listens and adds/removes `body.ut-revealed`
 *     so any `.ut-badge` spans become visible.
 */
export function EasterEggClient() {
  const [flash, setFlash] = useState(false);
  const buffer = useRef("");

  useEffect(() => {
    const sync = () => {
      const on = localStorage.getItem("utReveal") === "1";
      document.body.classList.toggle("ut-revealed", on);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("ut-reveal-changed", sync);

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      const ch = e.key.length === 1 ? e.key.toLowerCase() : "";
      if (!ch) return;
      buffer.current = (buffer.current + ch).slice(-TEXAS.length);
      if (buffer.current === TEXAS) {
        setFlash(true);
        buffer.current = "";
        window.setTimeout(() => setFlash(false), 1500);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ut-reveal-changed", sync);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return flash ? (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#BF5700] text-white"
    >
      <span className="font-[family-name:var(--font-display)] text-6xl font-bold tracking-tight sm:text-8xl">
        HOOK &lsquo;EM!
      </span>
    </div>
  ) : null;
}
