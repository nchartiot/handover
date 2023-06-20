'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Login() {
  const [email, setEmail] = useState('');
  const [view, setView] = useState<'login' | 'check-email'>('login');
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    console.log({ data, error });
    setView('check-email');
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-sm justify-center gap-2">
      {view === 'check-email' ? (
        <p className="text-center text-gray-400">
          Check <span className="font-bold text-white">{email}</span> to
          continue!
        </p>
      ) : (
        <form
          className="flex-1 flex flex-col w-full max-w-sm justify-center gap-2"
          onSubmit={handleSignIn}
        >
          <label className="text-md text-gray-400" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="you@example.com"
          />
          <button className="bg-green-700 rounded px-4 py-2 text-gray-200 mb-6">
            Sign In
          </button>
        </form>
      )}
    </div>
  );
}
