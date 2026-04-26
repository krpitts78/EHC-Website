"use client";

import { useMemo, useState } from "react";

export type DirectoryMember = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  suffix: string | null;
  spouse_name: string | null;
  member_number: string;
  board_role: string | null;
  board_role_label: string | null;
  is_admin: boolean;
  email: string | null;
  phone_home: string | null;
  phone_work: string | null;
  phone_cell: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  joined_year: number | null;
};

function displayName(m: DirectoryMember) {
  const first = m.preferred_name ?? m.first_name;
  const suffix = m.suffix ? ` ${m.suffix}` : "";
  return `${first} ${m.last_name}${suffix}`;
}

function searchHaystack(m: DirectoryMember) {
  return [
    m.first_name,
    m.last_name,
    m.preferred_name,
    m.member_number,
    m.email,
    m.city,
    m.state,
    m.spouse_name,
    m.board_role_label,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function MemberCard({ m }: { m: DirectoryMember }) {
  return (
    <article className="rounded-lg border border-[#a8a395] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#1a2128]">{displayName(m)}</h3>
          <p className="mt-0.5 text-xs text-[#5a6470]/70">
            {m.member_number}
            {m.joined_year ? ` · joined ${m.joined_year}` : ""}
          </p>
          {m.spouse_name && (
            <p className="text-xs text-[#5a6470]/70">
              Spouse: {m.spouse_name}
            </p>
          )}
        </div>
        {m.board_role_label ? (
          <span className="shrink-0 rounded bg-[#BF5700] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#1a2128]">
            {m.board_role_label}
          </span>
        ) : m.is_admin ? (
          <span className="shrink-0 rounded bg-[#5a6470] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#5a6470]">
            Website Admin
          </span>
        ) : null}
      </div>

      <div className="mt-3 space-y-1 text-sm text-[#5a6470]">
        {m.email && (
          <p>
            <a
              href={`mailto:${m.email}`}
              className="text-[#BF5700] hover:underline"
            >
              {m.email}
            </a>
          </p>
        )}
        {m.phone_cell && (
          <p>
            <a href={`tel:${m.phone_cell}`} className="hover:underline">
              {m.phone_cell}
            </a>{" "}
            <span className="text-[#5a6470]/60">cell</span>
          </p>
        )}
        {m.phone_home && (
          <p>
            <a href={`tel:${m.phone_home}`} className="hover:underline">
              {m.phone_home}
            </a>{" "}
            <span className="text-[#5a6470]/60">home</span>
          </p>
        )}
        {m.phone_work && (
          <p>
            <a href={`tel:${m.phone_work}`} className="hover:underline">
              {m.phone_work}
            </a>{" "}
            <span className="text-[#5a6470]/60">work</span>
          </p>
        )}
        {(m.address_line1 || m.city) && (
          <p className="text-[#5a6470]/80">
            {m.address_line1}
            {m.address_line1 && (m.city || m.state) ? ", " : ""}
            {m.city}
            {m.city && m.state ? ", " : ""}
            {m.state} {m.zip}
          </p>
        )}
      </div>
    </article>
  );
}

export function DirectoryList({
  board,
  everyone,
}: {
  board: DirectoryMember[];
  everyone: DirectoryMember[];
}) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | "board">("all");

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return { board, everyone };
    return {
      board: board.filter((m) => searchHaystack(m).includes(q)),
      everyone: everyone.filter((m) => searchHaystack(m).includes(q)),
    };
  }, [q, board, everyone]);

  const showBoard = scope === "all" || scope === "board";
  const showEveryone = scope === "all";

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, city, member #..."
          className="w-full max-w-md rounded border border-[#a8a395] bg-white px-3 py-2 text-sm text-white placeholder-[#d4c89c]/50 focus:border-[#BF5700] focus:outline-none"
        />
        <div className="inline-flex rounded border border-[#a8a395] bg-white p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setScope("all")}
            className={`rounded px-3 py-1 ${
              scope === "all"
                ? "bg-[#BF5700] text-[#1a2128]"
                : "text-[#5a6470] hover:text-[#1a2128]"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setScope("board")}
            className={`rounded px-3 py-1 ${
              scope === "board"
                ? "bg-[#BF5700] text-[#1a2128]"
                : "text-[#5a6470] hover:text-[#1a2128]"
            }`}
          >
            Board only
          </button>
        </div>
      </div>

      {showBoard && filtered.board.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-[#5a6470]">
            Board of Directors
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.board.map((m) => (
              <MemberCard key={m.id} m={m} />
            ))}
          </div>
        </section>
      )}

      {showEveryone && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-[#5a6470]">All Members</h2>
          {filtered.everyone.length === 0 ? (
            <p className="mt-3 text-sm text-[#5a6470]/70">No matches.</p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.everyone.map((m) => (
                <MemberCard key={m.id} m={m} />
              ))}
            </div>
          )}
        </section>
      )}

      {scope === "board" && filtered.board.length === 0 && (
        <p className="mt-8 text-sm text-[#5a6470]/70">No board matches.</p>
      )}
    </div>
  );
}
