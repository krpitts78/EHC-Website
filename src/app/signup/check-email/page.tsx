type SearchParams = Promise<{ email?: string }>;

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { email } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#1a2128] px-6 py-16">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-semibold text-[#1a2128]">Check your email</h1>
        <p className="mt-3 text-[#333F48]">
          We sent a verification link to{" "}
          <span className="font-medium">{email ?? "your inbox"}</span>. Click it to
          finish creating your account.
        </p>
        <p className="mt-6 text-sm text-[#333F48]/70">
          Didn&apos;t get it? Check spam, or contact a board member.
        </p>
      </div>
    </main>
  );
}
