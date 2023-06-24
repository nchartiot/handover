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
              <DialogDescription>
                Join us! Only email is required.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center gap-4 py-4">
              <p className="text-center">
                Check <span className="italic">{email}</span> to finish your
                sign in.
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Welcome</DialogTitle>
              <DialogDescription>
                Join us! Only email is required.
              </DialogDescription>
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
                <p className="text-center text-sm text-red-500">
                  {error.issues[0].message}
                </p>
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

// export default function Login() {
//   const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         emailRedirectTo: `${location.origin}/auth/callback`,
//       },
//     });
//     setView('check-email');
//   };

//   return (
//     <div className="flex-1 flex flex-col w-full max-w-sm justify-center gap-2">
//       {view === 'check-email' ? (
//         <p className="text-center text-neutral-400">
//           Check <span className="font-bold text-white">{email}</span> to
//           continue signing up
//         </p>
//       ) : (
//         <form
//           className="flex-1 flex flex-col w-full max-w-sm justify-center gap-2"
//           onSubmit={handleSignIn}
//         >
//           <label className="text-md text-neutral-400" htmlFor="email">
//             Email
//           </label>
//           <input
//             className="rounded-md px-4 py-2 bg-inherit border mb-6 text-neutral-100"
//             name="email"
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             placeholder="you@example.com"
//           />
//           <button className="bg-green-700 rounded px-4 py-2 text-neutral-200 mb-6">
//             Sign In
//           </button>
//           <p className="text-sm text-neutral-500 text-center">
//             Don't have an account?
//             <button
//               className="ml-1 text-white underline"
//               onClick={() => setView('sign-up')}
//             >
//               Sign Up Now
//             </button>
//           </p>
//         </form>
//       )}
//     </div>
//   );
// }
