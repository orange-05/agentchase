# 🕵️ AgentChase

> **Your personal AI collection agent** for Indian freelancers and solopreneurs.
> Upload an invoice → AgentChase extracts the details, then an LLM-driven agent sends smart, tone-adaptive payment reminders until the money lands.

🌐 **Landing page:** [agentchase.app](https://agentchase.app)  •  **Built with:** Next.js 16, Supabase, Gemini AI, Resend, Payoneer

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=for-the-badge&logo=supabase)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google)
![Resend](https://img.shields.io/badge/Email-Resend-000000?style=for-the-badge)
![Payoneer](https://img.shields.io/badge/Payouts-Payoneer%20%2B%20UPI-FF4F00?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 💸 The problem AgentChase solves

Indian freelancers lose **lakhs every year** to late payments. Manually chasing clients is awkward, time-consuming, and bad for relationships. AgentChase does it for you:

1. **Upload** a PDF invoice or enter the details manually
2. **Gemini AI** extracts the client, amount, and due date
3. The agent **drafts and sends** polite → firm reminders on a schedule
4. **You** get notified the moment the invoice is paid

---

## ✨ Features

- 📄 **AI invoice extraction** — `pdf-lib` + Gemini Vision to parse client, amount, due date from a PDF
- 🤖 **Agentic chase loop** — tone escalates politely → firmly → firmly+urgent based on days overdue
- 📨 **Email delivery** via [Resend](https://resend.com) (transactional API)
- 💰 **Payoneer & UPI ready** — track payouts and balance in one place
- 🔐 **Supabase auth + RLS** — sign in with Google/email; row-level security on every table
- 📊 **Dashboard** — Kanban-style view of pending / chased / paid invoices
- 💳 **Two pricing tiers** — Pay-Per-Chase (₹99/chase) and Unlimited Agent (₹499/month)
- 🧾 **PDF invoice generator** — generate clean, branded invoices on the fly

---

## 🏗️ Architecture

```
agentchase/
├── app/
│   ├── page.tsx                    # marketing landing (hero, features, pricing)
│   ├── layout.tsx                  # root layout
│   ├── login/                      # Supabase auth UI
│   ├── auth/callback/              # OAuth handler
│   ├── dashboard/                  # main app — invoice list, modals, chase triggers
│   ├── payment/                    # plan selection + activation
│   └── api/
│       ├── extract/                # POST: PDF/image → structured invoice (Gemini Vision)
│       ├── chase/                  # POST: invoiceId → send a chase email (Gemini + Resend)
│       └── payoneer/request/       # POST: plan/amount → activate subscription row
├── lib/
│   └── supabase.ts                 # client-side Supabase client
├── supabase/
│   └── create_subscriptions.sql    # table schema for the subscriptions table
├── public/                         # static assets
├── next.config.ts                  # static export, unoptimized images
└── package.json
```

### Data flow

```
User uploads PDF
   │
   ▼
POST /api/extract  ──►  Gemini Vision  ──►  { client, amount, due_date }
   │
   ▼
Insert row into Supabase `invoices`
   │
   ▼
User clicks "Chase"
   │
   ▼
POST /api/chase  ──►  Gemini (draft email)  ──►  Resend (send)
   │
   ▼
Update invoice status → "chasing"
   │
   ▼
Cron / manual retry until status = "paid"
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17+
- **Supabase** project — [supabase.com](https://supabase.com)
- **Google AI Studio** key — [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- **Resend** API key — [resend.com](https://resend.com)

### 1. Install

```bash
git clone https://github.com/orange-05/agentchase.git
cd agentchase
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project
2. Run the SQL in `supabase/create_subscriptions.sql`
3. Add the `invoices` table:

   ```sql
   create table if not exists public.invoices (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) on delete cascade,
     client_name text not null,
     client_email text not null,
     amount numeric not null,
     due_date date not null,
     status text not null default 'pending',  -- pending | chasing | paid | overdue
     chase_count int not null default 0,
     created_at timestamptz not null default now()
   );

   alter table public.invoices enable row level security;
   create policy "users see own invoices"
     on public.invoices for select to authenticated
     using (auth.uid() = user_id);
   create policy "users insert own invoices"
     on public.invoices for insert to authenticated
     with check (auth.uid() = user_id);
   ```

4. Copy the **Project URL**, **anon key**, and **service-role key** from Supabase → Project Settings → API

### 3. Environment variables

Create `.env.local`:

```bash
# Google AI
GEMINI_API_KEY=your_gemini_key

# Resend (transactional email)
RESEND_API_KEY=your_resend_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run

```bash
npm run dev          # http://localhost:3000
npm run build        # static export
npm run start        # next start
npm run lint         # eslint
```

---

## 🧠 How the "AI Agent" Works

The agent lives in `app/api/chase/route.ts`. For a given invoice:

1. **Reads** the invoice row from Supabase (service-role key, bypasses RLS)
2. **Builds a context prompt** with the client name, amount, days overdue, and chase count
3. **Calls Gemini** with a system prompt that escalates tone:
   - **0–3 days:** "Just a friendly reminder…"
   - **4–10 days:** "Following up on the unpaid invoice…"
   - **11+ days:** "This is now overdue. Please settle at the earliest."
4. **Sends the email** via Resend
5. **Updates** the invoice row (`chase_count++`, `status = "chasing"`)

The agent is intentionally **stateless** — every chase is a fresh prompt. A future version can move this into a Durable Object / Supabase Edge Function with a small state machine for retry timing.

---

## 💳 Pricing

| Plan | Price | Includes |
|---|---|---|
| **Pay-Per-Chase** | ₹99 / successful chase | Unlimited invoices, AI reminders, Payoneer withdrawal |
| **Unlimited Agent** ⭐ | ₹499 / month | Unlimited chases, priority agent, Payoneer + UPI, WhatsApp (soon) |

Subscriptions are managed server-side in `app/api/payoneer/request/route.ts` (deactivates old rows, inserts a 30-day `active` row for the new plan).

---

## 🛠️ Tech Stack

- **Frontend** — Next.js 16 App Router, React 19, TypeScript, Tailwind 4
- **Auth & DB** — Supabase (Postgres + Auth + RLS)
- **AI** — Google Generative AI (`@google/generative-ai`)
- **Email** — Resend
- **PDF** — `pdf-lib` (generation), Gemini Vision (extraction)
- **Icons** — `lucide-react`
- **Toasts** — `react-hot-toast`

---

## 🗺️ Roadmap

- [ ] Supabase Edge Function cron for autonomous scheduling
- [ ] WhatsApp Business API integration for India-first reminders
- [ ] Multi-currency support (USD / EUR / INR)
- [ ] Team / agency plan (one workspace, multiple freelancers)
- [ ] Stripe-backed subscriptions (currently the payment page is a manual flow)

---

## 📄 License

MIT — see `LICENSE` for details.
