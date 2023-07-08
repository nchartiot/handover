import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';

import { HeroImage } from '@/components/hero-image';
import { LoginDialog } from '@/components/login-dialog';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-dotted-spacing-4 bg-dotted-gray-200 dark:bg-dotted-gray-900">
      <div className="relative isolate pt-14">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                <Balancer>Bridge the gap between design and development</Balancer>
              </h1>
              <p className="mt-6 text-lg leading-8">
                <Balancer>
                  We&apos;re not just enhancing the handoff process, we&apos;re reinventing it.
                  Experience continuous communication, efficient workflows, and a shared
                  understanding that surpasses the traditional handoff method.
                </Balancer>
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {user ? (
                  <Button asChild>
                    <Link href="/dashboard" className="ml-8!">
                      Go to dashboard
                    </Link>
                  </Button>
                ) : (
                  <LoginDialog />
                )}
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <HeroImage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
