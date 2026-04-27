'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Completing login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle hash-based token (#access_token=...) — Supabase implicit flow
        // The Supabase client automatically parses hash tokens on getSession()
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          setStatus('Login failed. Redirecting...');
          setTimeout(() => router.replace('/login'), 1500);
          return;
        }

        if (session) {
          setStatus('Login successful! Redirecting...');
          router.replace('/payment');
        } else {
          // No session yet — try exchanging the code if present in URL params
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');

          if (code) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              console.error('Code exchange error:', exchangeError);
              setStatus('Login failed. Redirecting...');
              setTimeout(() => router.replace('/login'), 1500);
            } else {
              router.replace('/payment');
            }
          } else {
            setStatus('No session found. Redirecting...');
            setTimeout(() => router.replace('/login'), 1500);
          }
        }
      } catch (err) {
        console.error('Callback error:', err);
        setStatus('Something went wrong. Redirecting...');
        setTimeout(() => router.replace('/login'), 1500);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-6 animate-pulse">🕵️</div>
        <p className="text-xl font-semibold mb-2">AgentChase</p>
        <p className="text-zinc-400">{status}</p>
        <div className="mt-6 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
