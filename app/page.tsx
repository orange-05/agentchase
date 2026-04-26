import Link from 'next/link';

export default function LandingPage() {
  return (
 codex/deploy-project-to-netlify-with-landing-page-ruwyj5
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f254a_0%,_#050b16_55%,_#000_100%)] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-zinc-100">
          <span className="text-green-400">●</span>
          Built for Indian Freelancers &amp; Solopreneurs
        </span>

        <h1 className="text-6xl font-bold leading-tight tracking-tight md:text-8xl">
          Never Chase
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Payments Again
          </span>
        </h1>

        <p className="mt-8 max-w-4xl text-2xl text-zinc-300 md:text-4xl/relaxed">
          Your personal AI agent that automatically sends smart reminders, tracks payments &amp; helps you get paid faster.
        </p>

        <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row">
          <Link
            href="/login"
            className="rounded-3xl bg-blue-600 px-12 py-6 text-3xl font-semibold transition hover:scale-105 hover:bg-blue-500 md:text-4xl"
          >
            Start Free Trial →
          </Link>
          <a
            href="#features"
            className="rounded-3xl border border-white/30 px-12 py-6 text-3xl font-semibold transition hover:border-white md:text-4xl"
          >
            Watch Demo
          </a>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-8 text-lg text-zinc-300 md:text-2xl">
          <span className="flex items-center gap-2">
            <span className="text-green-400">✓</span> No Credit Card
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-400">✓</span> 14 Days Free
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Cancel Anytime
          </span>
        </div>
      </section>

      <section id="features" className="px-6 pb-16 text-center text-zinc-500">
        Demo section placeholder
      </section>
=======
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
 main
    </main>
  );
}
