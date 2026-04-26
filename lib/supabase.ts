import { createClient } from '@supabase/supabase-js';

 codex/deploy-project-to-netlify-with-landing-page-ruwyj5
=======
 codex/deploy-project-to-netlify-with-landing-page-qbktyk
 main
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if ((!supabaseUrl || !supabaseAnonKey) && typeof window !== 'undefined') {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  supabaseUrl ?? 'https://invalid-project.supabase.co',
  supabaseAnonKey ?? 'invalid-anon-key'
);
 codex/deploy-project-to-netlify-with-landing-page-ruwyj5
=======
=======
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
 main
 main
