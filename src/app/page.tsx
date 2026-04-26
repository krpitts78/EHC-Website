import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "./InquiryForm";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[#1d2a1d] text-white">
      <header className="border-b border-[#4a5d3e]/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="EHC" width={48} height={48} />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Executive Hunting Club
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="#inquire" className="hidden text-[#d4c89c] hover:text-white sm:inline">
              Membership inquiry
            </a>
            <Link
              href="/login"
              className="rounded bg-[#BF5700] px-4 py-2 font-medium text-white hover:bg-[#7a3500]"
            >
              Member login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#4a5d3e]/60">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
          <Image
            src="/logo.png"
            alt="Executive Hunting Club"
            width={150}
            height={150}
            priority
          />
          <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
            Executive Hunting Club
          </h1>
          <p className="mt-3 text-lg text-[#d4c89c]">
            A Texas non-profit hunting and fishing club, founded 1975.
          </p>
          <p className="mt-1 text-sm text-[#d4c89c]/70">
            Charter No.&nbsp;366138 &middot; Houston, Texas
          </p>
        </div>
      </section>

      {/* About */}
      <section className="border-b border-[#4a5d3e]/60">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-semibold">About the Club</h2>
          <div className="mt-6 space-y-4 text-[#d4c89c]">
            <p>
              The Executive Hunting Club traces its roots to an organized
              hunting trip to Laredo, Texas in September 1973. Charter members
              paid their first year&apos;s dues in early 1974 and were
              instrumental in formalizing the club shortly afterward.
            </p>
            <p>
              For 50+ years EHC has been a fellowship of sportsmen bound
              together by hunting, fishing, and the outdoors. Membership is by
              sponsor proposal — every member is brought in by another, and the
              Board reviews each candidate.
            </p>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="border-b border-[#4a5d3e]/60 bg-[#2a3624]/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold">What members do</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card
              title="Annual Fall Dove Hunt"
              body="A long-running tradition every October, members and their guests gather for a weekend of dove hunting and fellowship."
            />
            <Card
              title="Annual Spring Fling"
              body="The club&apos;s spring trip — fishing, fellowship, and the official kickoff to the warm-weather season."
            />
            <Card
              title="Beach House on Bolivar"
              body="Members can reserve weeks year-round at the club&apos;s beach house on Tropicana Drive, just past the Galveston Ferry."
            />
          </div>
        </div>
      </section>

      {/* Beach House detail */}
      <section className="border-b border-[#4a5d3e]/60">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-semibold">The Beach House</h2>
          <div className="mt-6 space-y-4 text-[#d4c89c]">
            <p>
              The EHC owns a member-only beach house at{" "}
              <span className="text-white">2940 Tropicana Drive</span> in the
              Ramada Beach Subdivision on Bolivar Peninsula, about 13 miles
              past the Galveston Ferry on Highway 87.
            </p>
            <p>
              Members reserve Friday-to-Friday weeks at $1,000 per prime week
              (May through Labor Day) and $600 per non-prime week, plus a $125
              housekeeping fee. Bookings open one year in advance.
            </p>
          </div>
        </div>
      </section>

      {/* Membership */}
      <section className="border-b border-[#4a5d3e]/60 bg-[#2a3624]/40">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-semibold">Membership</h2>
          <div className="mt-6 space-y-4 text-[#d4c89c]">
            <p>
              Per the club&apos;s bylaws, any adult is eligible for membership
              provided they are proposed by one member and seconded by another.
              The proposal goes to the Secretary of the Board of Trustees, who
              presents the candidate at the next board meeting. A two-thirds
              vote of the Board elects to membership.
            </p>
            <p>
              Annual dues are currently <span className="text-white">$250</span>{" "}
              for regular members. New members pay the initiation fee, if any,
              and the first year&apos;s dues upon election.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section id="inquire" className="border-b border-[#4a5d3e]/60">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="text-2xl font-semibold">Membership inquiry</h2>
          <p className="mt-2 text-[#d4c89c]">
            Interested in joining? Tell us a bit about yourself. A board member
            will be in touch.
          </p>
          <div className="mt-8">
            <InquiryForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#141a10]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-[#d4c89c]/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Executive Hunting Club &middot; Houston, Texas
            <br />
            Charter No.&nbsp;366138 &middot; Founded August 11, 1975
          </div>
          <Link href="/login" className="text-[#F8971F] hover:text-white">
            Member login →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-lg border border-[#4a5d3e] bg-[#1d2a1d] p-6">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p
        className="mt-2 text-sm text-[#d4c89c]"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </article>
  );
}
