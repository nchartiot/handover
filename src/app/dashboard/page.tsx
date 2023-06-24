import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { DashboardCard } from '@/components/dashboard-card';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: screens } = await supabase.from('screens').select('*');
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(screens)}</pre>
      {screens?.map((screen) => (
        <DashboardCard key={screen.id} htmlString={screen.html_file} name={screen.name} />
      ))}
    </div>
  );
}
