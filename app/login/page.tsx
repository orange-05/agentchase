'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/payment');
    });
  }, [router]);

  const signInWithGoogle = async () => {
    setLoading(true);
    // Always use the canonical site URL so Supabase redirects to the correct host.
    // NEXT_PUBLIC_SITE_URL must be set in Netlify env vars AND whitelisted in
    // Supabase Dashboard → Authentication → URL Configuration → Redirect URLs.
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const redirectTo = `${siteUrl}/auth/callback`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <span className="text-5xl">🕵️</span>
            <h1 className="text-5xl font-bold">AgentChase</h1>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-center mb-8">Sign in to continue</h2>

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-medium hover:bg-gray-100 mb-4 disabled:opacity-60"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative text-center text-sm text-zinc-500">or continue with email</div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={signInWithEmail} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => {
              if (!email || !password) return alert('Enter email and password first');
              setLoading(true);
              supabase.auth.signUp({ email, password }).then(({ error }) => {
                setLoading(false);
                if (error) alert(error.message);
                else alert('Check your email to confirm your account!');
              });
            }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
