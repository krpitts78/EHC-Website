import Image from "next/image";

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
      <p className="mt-12 text-sm text-[#D6D2C4]/70">
        Member portal coming soon.
      </p>
    </main>
  );
}
