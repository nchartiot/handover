'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import { z, type ZodError } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const emailSchema = z.string().email('This is not a valid email.');

export function LoginDialog() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<ZodError>();
  const [view, setView] = useState<'sign-in' | 'check-email'>('sign-in');
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const result = await emailSchema.safeParseAsync(email);

    if (!result.success) {
      console.log(result.error);
      setError(result.error);
      return;
    }

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    setView('check-email');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Sign In</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[465px]">
        {view === 'check-email' ? (
          <>
            <DialogHeader>
              <DialogTitle>Welcome</DialogTitle>
              <DialogDescription>Join us! Only email is required.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center gap-4 py-4">
              <p className="text-center">
                Check <span className="italic">{email}</span> to finish your sign in.
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Welcome</DialogTitle>
              <DialogDescription>Join us! Only email is required.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col justify-center gap-1 py-4">
              <div className="flex items-center gap-4 py-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                  placeholder="you@example.com"
                />
              </div>
              {error && (
                <p className="text-center text-sm text-red-500">{error.issues[0].message}</p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleSignIn} type="submit">
                Sign In
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
