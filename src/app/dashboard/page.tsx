import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { DashboardCard } from '@/components/dashboard-card';
import { Skeleton } from '@/components/ui/skeleton';
import { UploadScreenDialog } from '@/components/upload-screen-dialog';
import { Database } from '@/types/supabase';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Dashboard - Handover',
};

function LoadingDashboard() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton className="h-52 max-w-md" key={i} />
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: screens } = await supabase.from('latest_screens').select('name, id, version');

  return (
    <div className="px-14 py-8">
      <div className="flex h-10 items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Screen Dashboard!</h3>
        <UploadScreenDialog />
      </div>
      <hr className="my-8" />

      <Suspense fallback={<LoadingDashboard />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {screens?.map((screen) => {
            if (!screen || !screen.name || !screen.id) return null;

            return (
              <div key={screen.id}>
                <p>{screen.version}</p>
                <DashboardCard key={screen.id} name={screen.name} id={screen.id} />
              </div>
            );
          })}
        </div>
      </Suspense>
    </div>
  );
}
