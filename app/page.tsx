'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard');
    });
  }, [router]);

  const signInWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'http://localhost:3000/auth/callback' }
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push('/dashboard');
    setLoading(false);
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
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-medium hover:bg-gray-100 mb-4"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-700"></div></div>
            <div className="relative text-center text-sm text-zinc-500">or continue with email</div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={(e) => { e.preventDefault(); const form = e.currentTarget; signInWithEmail(form.email.value, form.password.value); }} className="space-y-4">
            <input type="email" name="email" placeholder="Email address" className="w-full bg-zinc-800 rounded-2xl px-5 py-4" required />
            <input type="password" name="password" placeholder="Password" className="w-full bg-zinc-800 rounded-2xl px-5 py-4" required />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Don&apos;t have an account? <span className="text-blue-400 cursor-pointer" onClick={() => supabase.auth.signUp({ email: 'test@example.com', password: '123456' })}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
