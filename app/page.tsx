import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-zinc-200">
          🕵️ AI assistant for invoice follow-ups
        </span>

        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
          Welcome to <span className="text-blue-400">AgentChase</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-zinc-400 md:text-xl">
          Track invoices, send smarter payment reminders, and keep your collections organized in one place.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-500"
          >
            Continue to Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-zinc-700 px-8 py-4 font-semibold text-zinc-200 transition hover:border-zinc-500"
          >
            Open Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
