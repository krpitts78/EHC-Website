import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[#333F48]">
      <SiteHeader />
      <Hero />
      <About />
      <Activities />
      <BeachHouse />
      <HowToJoin />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#5a6470]/60 bg-[#1a2128]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="EHC"
            width={40}
            height={40}
            className="brightness-0 invert"
          />
          <span className="font-[family-name:var(--font-display)] text-base text-[#BF5700] sm:text-lg">
            Executive Hunting Club
          </span>
        </Link>
        <Link
          href="/login"
          className="rounded bg-[#BF5700] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#7a3500]"
        >
          Member login
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#5a6470]/60 bg-[#333F48]">
      {/* Faint topographic-feel SVG background */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#d4c89c" />
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#dots)" />
      </svg>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center sm:py-32">
        <Image
          src="/logo.png"
          alt="Executive Hunting Club"
          width={140}
          height={140}
          priority
          className="brightness-0 invert"
        />

        <h1 className="mt-8 font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-[#BF5700] sm:text-6xl">
          Executive Hunting Club
        </h1>
        <Divider />
        <p className="font-[family-name:var(--font-display)] text-xl italic text-[#d4c89c] sm:text-2xl">
          Hunting, fishing, and fellowship since 1973.
        </p>

        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-[#d4c89c]/60">
          Houston, Texas &nbsp;·&nbsp; Charter No.&nbsp;366138
        </p>

        <Link
          href="/login"
          className="mt-12 rounded border border-[#d4c89c]/50 px-6 py-3 font-medium text-[#d4c89c] hover:border-[#d4c89c] hover:text-white"
        >
          Member login
        </Link>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="bg-[#D6D2C4] text-[#333F48]">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[2fr_1fr] md:py-24">
        <div>
          <SectionHeading kicker="About the Club" title="Five decades of fellowship in the field" />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#3a3826]">
            <p>
              The Executive Hunting Club traces its roots to an organized
              hunting trip to Laredo, Texas in September 1973. Charter members
              paid their first year&apos;s dues in early 1974 and formalized
              the club shortly afterward.
            </p>
            <p>
              For 50+ years EHC has been a fellowship of sportsmen bound
              together by hunting, fishing, and the outdoors. Membership is by
              sponsor proposal — every member is brought in by another, and
              the Board of Trustees reviews each candidate.
            </p>
          </div>
        </div>

        <aside className="rounded-lg border-l-4 border-[#BF5700] bg-white/60 p-6 shadow-sm">
          <p className="font-[family-name:var(--font-display)] text-xl italic leading-relaxed text-[#333F48]">
            &ldquo;Charter members participated in the organized hunting trip
            to Laredo, Texas in September of 1973 … and were instrumental in
            the formation and structure of The Executive Hunting Club.&rdquo;
          </p>
          <p className="mt-3 text-xs uppercase tracking-wider text-[#7a3500]">
            — Bylaws, Article&nbsp;I
          </p>
        </aside>
      </div>
    </section>
  );
}

function Activities() {
  return (
    <section className="border-t border-[#5a6470]/60 bg-[#333F48] text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="text-center">
          <SectionHeading
            dark
            kicker="What members do"
            title="Trips, traditions, and time at the coast"
          />
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Activity
            number="01"
            title="Annual Fall Dove Hunt"
            body="A long-running tradition every October — members and their guests gather for a weekend of dove hunting and camaraderie."
          />
          <Activity
            number="02"
            title="Annual Spring Fling"
            body="The club's spring trip — fishing, fellowship, and the official kickoff to the warm-weather season."
          />
          <Activity
            number="03"
            title="Beach House on Bolivar"
            body="A member-only beach house on the Bolivar Peninsula, available year-round Friday-to-Friday."
          />
        </div>
      </div>
    </section>
  );
}

function BeachHouse() {
  return (
    <section className="bg-[#D6D2C4] text-[#333F48]">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <SectionHeading kicker="The Beach House" title="On the Bolivar Peninsula" />
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#3a3826]">
          <p>
            The EHC owns a member-only beach house at{" "}
            <strong>2940 Tropicana Drive</strong> in the Ramada Beach
            Subdivision on Bolivar Peninsula, about 13 miles past the
            Galveston Ferry on Highway 87.
          </p>
          <p>
            Members reserve Friday-to-Friday weeks, with bookings opening one
            full year in advance. Prime weeks run from May through Labor Day;
            non-prime weeks fill the rest of the year.
          </p>
        </div>
        <p className="mt-10 text-xs uppercase tracking-[0.2em] text-[#7a3500]">
          Members only · Sign in to reserve
        </p>
      </div>
    </section>
  );
}

function HowToJoin() {
  const steps = [
    {
      n: "01",
      title: "Find a sponsor",
      body: "Per the bylaws, every prospective member must be proposed by one current member and seconded by another. Reach out to whoever you know in the club.",
    },
    {
      n: "02",
      title: "Submit your inquiry",
      body: "Use the form below — even if you don't yet have a sponsor. The Board will be in touch and can help connect you.",
    },
    {
      n: "03",
      title: "Board review",
      body: "The Board of Trustees reviews each candidate. Election to membership requires a two-thirds vote and payment of dues.",
    },
  ];
  return (
    <section className="border-t border-[#5a6470]/60 bg-[#1a2128] text-white">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <div className="text-center">
          <SectionHeading
            dark
            kicker="Joining the Club"
            title="How membership works"
          />
        </div>
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-lg border border-[#5a6470] bg-[#333F48] p-6"
            >
              <span className="font-[family-name:var(--font-display)] text-3xl text-[#d4c89c]">
                {s.n}
              </span>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#d4c89c]">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-[#5a6470]/60 bg-[#1a2128]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-[#d4c89c]/70 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] text-base text-[#BF5700]">
            Executive Hunting Club
          </p>
          <p className="mt-1">
            Houston, Texas · Charter No.&nbsp;366138 · Founded August 11, 1975
          </p>
        </div>
        <Link href="/login" className="text-[#BF5700] hover:text-white">
          Member login →
        </Link>
      </div>
    </footer>
  );
}

/* ---------- shared bits ---------- */

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px w-12 bg-[#D4AF37]/80" />
      <span aria-hidden className="text-[#D4AF37]">
        ✦
      </span>
      <span className="h-px w-12 bg-[#D4AF37]/80" />
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  dark,
}: {
  kicker: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <>
      <p
        className={`text-xs font-semibold uppercase tracking-[0.25em] ${
          dark ? "text-[#BF5700]" : "text-[#7a3500]"
        }`}
      >
        {kicker}
      </p>
      <h2
        className={`mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold sm:text-4xl ${
          dark ? "text-white" : "text-[#333F48]"
        }`}
      >
        {title}
      </h2>
    </>
  );
}

function Activity({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <article className="group rounded-lg border border-[#5a6470] bg-[#4a5763] p-6 transition-colors hover:border-[#BF5700]">
      <span className="font-[family-name:var(--font-display)] text-3xl text-[#d4c89c]">
        {number}
      </span>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[#d4c89c]">{body}</p>
    </article>
  );
}

