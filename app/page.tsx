import Link from 'next/link';

export default function LandingPage() {
  return (
 codex/deploy-project-to-netlify-with-landing-page-det6un
    <main className="overflow-x-hidden bg-black text-white">
      <section className="min-h-screen bg-[linear-gradient(135deg,_#0f172a_0%,_#1e2937_100%)] relative flex items-center">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-md">
            <span className="text-green-400">●</span>
            <span className="text-sm font-medium">Built for Indian Freelancers &amp; Solopreneurs</span>
          </div>

          <h1 className="mb-6 text-6xl font-bold leading-tight md:text-7xl">
            Never Chase
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Payments Again
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl text-zinc-400 md:text-2xl">
            Your personal AI agent that automatically sends smart reminders,
            <br />
            tracks payments &amp; helps you get paid faster.
          </p>

          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              href="/login"
              className="group flex items-center gap-3 rounded-3xl bg-blue-600 px-10 py-5 text-xl font-semibold transition-all hover:scale-105 hover:bg-blue-500"
            >
              Start Free Trial
              <span className="transition-transform group-active:rotate-45">→</span>
            </Link>
            <a
              href="#features"
              className="rounded-3xl border border-white/30 px-8 py-5 text-xl font-medium transition hover:border-white"
            >
              Watch Demo
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-zinc-400">
            <div className="flex items-center gap-2"><span className="text-green-500">✓</span> No Credit Card</div>
            <div className="flex items-center gap-2"><span className="text-green-500">✓</span> 14 Days Free</div>
            <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Cancel Anytime</div>
          </div>
        </div>
      </section>

      <div className="border-b border-white/10 py-8 text-center text-zinc-400">
        <p className="mb-4 text-sm">Trusted by freelancers using</p>
        <div className="flex justify-center gap-12 opacity-75">
          <span className="text-xl font-semibold">Razorpay</span>
          <span className="text-xl font-semibold">Payoneer</span>
          <span className="text-xl font-semibold">Groww</span>
        </div>
      </div>

      <section id="features" className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-5xl font-bold">Your AI Collection Agent</h2>
          <p className="mb-16 text-center text-zinc-400">Smart. Polite. Relentless.</p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_25px_50px_-12px_rgb(59_130_246_/_0.4)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">📄</div>
              <h3 className="mb-3 text-2xl font-semibold">Instant Invoice Intelligence</h3>
              <p className="text-zinc-400">Upload PDF or enter details → AI extracts client, amount, due date automatically.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_25px_50px_-12px_rgb(59_130_246_/_0.4)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl">🤖</div>
              <h3 className="mb-3 text-2xl font-semibold">Agentic Follow-ups</h3>
              <p className="text-zinc-400">AI decides tone (polite → firm) and sends personalized reminders at perfect timing.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_25px_50px_-12px_rgb(59_130_246_/_0.4)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-3xl">💰</div>
              <h3 className="mb-3 text-2xl font-semibold">Payoneer + Razorpay Ready</h3>
              <p className="text-zinc-400">Track payments easily. Withdraw earnings via Payoneer or UPI instantly.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-black py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-4 text-center text-5xl font-bold">Choose Your Plan</h2>
          <p className="mb-16 text-center text-zinc-400">Start free. Grow with confidence.</p>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-700 bg-white/5 p-10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_25px_50px_-12px_rgb(59_130_246_/_0.4)]">
              <h3 className="text-2xl font-semibold">Pay-Per-Chase</h3>
              <p className="mt-6 text-6xl font-bold">₹99</p>
              <p className="text-zinc-400">per successful chase</p>
              <ul className="mt-10 space-y-4">
                <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Unlimited Invoices</li>
                <li className="flex items-center gap-3"><span className="text-green-500">✓</span> AI Reminders</li>
                <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Payoneer Withdrawal</li>
              </ul>
              <Link
                href="/login"
                className="mt-12 block w-full rounded-2xl bg-white py-5 text-center text-lg font-semibold text-black transition hover:scale-105"
              >
                Get Started Free
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-3xl border-2 border-blue-600 bg-white/5 p-10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_25px_50px_-12px_rgb(59_130_246_/_0.4)]">
              <div className="absolute -top-3 right-6 rounded-full bg-blue-600 px-5 py-1 text-xs">RECOMMENDED</div>
              <h3 className="text-2xl font-semibold">Unlimited Agent</h3>
              <p className="mt-6 text-6xl font-bold">₹499</p>
              <p className="text-zinc-400">/month</p>
              <ul className="mt-10 space-y-4">
                <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Unlimited Chases</li>
                <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Priority AI Agent</li>
                <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Payoneer + Razorpay</li>
                <li className="flex items-center gap-3"><span className="text-green-500">✓</span> WhatsApp Reminders (Soon)</li>
              </ul>
              <Link
                href="/login"
                className="mt-12 block w-full rounded-2xl bg-blue-600 py-5 text-center text-lg font-semibold transition hover:scale-105"
              >
                Start 14 Days Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-16 text-center text-zinc-500">
        <p className="text-lg">Made with ❤️ in Bengaluru for Indian creators</p>
        <p className="mt-2">© 2026 AgentChase • Powered by Grok</p>
      </footer>
=======
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
 main
    </main>
  );
}
