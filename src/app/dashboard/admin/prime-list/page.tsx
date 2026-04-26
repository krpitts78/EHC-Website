import { createClient } from "@/lib/supabase/server";
import { togglePrimeListAction } from "./actions";

export default async function PrimeListPage() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("members")
    .select("id, first_name, last_name, member_number, is_prime_list")
    .order("last_name");

  const onList = (members ?? []).filter((m) => m.is_prime_list);
  const offList = (members ?? []).filter((m) => !m.is_prime_list);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 text-white">
      <h1 className="text-3xl font-semibold">Prime-time list</h1>
      <p className="mt-2 text-sm text-[#D6D2C4]">
        Members on this list can reserve Prime weeks (May–Labor Day).
      </p>

      <Section title={`On the list (${onList.length})`}>
        {onList.map((m) => (
          <Row key={m.id} m={m} />
        ))}
      </Section>

      <Section title={`Not on the list (${offList.length})`}>
        {offList.map((m) => (
          <Row key={m.id} m={m} />
        ))}
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#D6D2C4]/70">
        {title}
      </h2>
      <ul className="mt-2 divide-y divide-[#333F48] rounded-lg border border-[#333F48] bg-[#222b33]">
        {children}
      </ul>
    </section>
  );
}

function Row({
  m,
}: {
  m: {
    id: string;
    first_name: string;
    last_name: string;
    member_number: string;
    is_prime_list: boolean;
  };
}) {
  return (
    <li className="flex items-center justify-between px-4 py-2 text-sm">
      <span>
        {m.last_name}, {m.first_name}{" "}
        <span className="text-[#D6D2C4]/60">{m.member_number}</span>
      </span>
      <form action={togglePrimeListAction}>
        <input type="hidden" name="id" value={m.id} />
        <input type="hidden" name="next" value={m.is_prime_list ? "false" : "true"} />
        <button
          type="submit"
          className={`rounded px-3 py-1 text-xs font-medium ${
            m.is_prime_list
              ? "border border-[#D6D2C4]/40 text-[#D6D2C4] hover:border-[#D6D2C4] hover:text-white"
              : "bg-[#BF5700] text-white hover:bg-[#7a3500]"
          }`}
        >
          {m.is_prime_list ? "Remove" : "Add"}
        </button>
      </form>
    </li>
  );
}
