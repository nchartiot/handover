import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { DashboardCard } from '@/components/dashboard-card';
import { UploadScreenDialog } from '@/components/upload-screen-dialog';
import { Database } from '@/types/supabase';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: screens } = await supabase.from('screens').select('*');
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  return (
    <div className="px-14 py-4">
      <div className="flex items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Welcome, {user.email}</h3>
        <UploadScreenDialog />
      </div>
      {screens?.map((screen) => (
        <DashboardCard key={screen.id} htmlString={screen.html_file} name={screen.name} />
      ))}
    </div>
  );
}
