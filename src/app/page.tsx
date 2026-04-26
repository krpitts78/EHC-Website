import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#1a2128] text-white px-6 py-16">
      <Image
        src="/logo.png"
        alt="Executive Hunting Club"
        width={200}
        height={200}
        priority
      />
      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-center">
        Executive Hunting Club
      </h1>
      <p className="mt-3 text-[#D6D2C4] text-center max-w-xl">
        A Texas non-profit hunting and fishing club, founded August 11, 1975.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="rounded bg-[#BF5700] px-6 py-2.5 font-medium text-white hover:bg-[#7a3500]"
        >
          Member login
        </Link>
        <Link
          href="/signup"
          className="rounded border border-[#D6D2C4] px-6 py-2.5 font-medium text-[#D6D2C4] hover:bg-[#D6D2C4] hover:text-[#1a2128]"
        >
          New member signup
        </Link>
      </div>
    </main>
  );
}
