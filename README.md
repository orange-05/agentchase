# AgentChase

AgentChase is a Next.js app for invoice reminders and payment follow-ups.

## App flow

1. `/` → Landing page
2. `/login` → Authentication
3. `/dashboard` → Main app after login

## Local development

```bash
npm install
npm run dev
```

 codex/deploy-project-to-netlify-with-landing-page-det6un
=======
 codex/deploy-project-to-netlify-with-landing-page-ruwyj5
=======
 codex/deploy-project-to-netlify-with-landing-page-qbktyk
 main
 main
Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
RESEND_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
 codex/deploy-project-to-netlify-with-landing-page-det6un

> Never commit real API keys to git. If keys are shared publicly, rotate them immediately.

## Deploy to Netlify

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Netlify, choose **Add new site** → **Import an existing project**.
3. Select this repository.
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** leave default for Next.js (Netlify runtime handles it)
5. Add environment variables in Netlify site settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. In Supabase Auth settings, add your Netlify callback URL:
   - `https://<your-netlify-site>.netlify.app/auth/callback`
7. Deploy.

=======

> Never commit real API keys to git. If keys are shared publicly, rotate them immediately.

 codex/deploy-project-to-netlify-with-landing-page-ruwyj5
=======
=======
 main
 main
## Deploy to Netlify

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Netlify, choose **Add new site** → **Import an existing project**.
3. Select this repository.
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** leave default for Next.js (Netlify runtime handles it)
5. Add environment variables in Netlify site settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 codex/deploy-project-to-netlify-with-landing-page-ruwyj5
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
=======
 codex/deploy-project-to-netlify-with-landing-page-qbktyk
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
=======
 main
 main
6. In Supabase Auth settings, add your Netlify callback URL:
   - `https://<your-netlify-site>.netlify.app/auth/callback`
7. Deploy.

 main
`netlify.toml` already includes the Netlify Next.js runtime plugin.
