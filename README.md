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
6. In Supabase Auth settings, add your Netlify callback URL:
   - `https://<your-netlify-site>.netlify.app/auth/callback`
7. Deploy.

`netlify.toml` already includes the Netlify Next.js runtime plugin.
