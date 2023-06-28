import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { Database } from '@/types/supabase';

export default async function ScreenPage({ params }: { params: { id: number } }) {
  const screenId = params.id || 0;
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: screen } = await supabase.from('screens').select('*').eq('id', screenId);

  return (
    <div className="px-14 py-4">
      <div className="flex items-center justify-between">
        <pre>{JSON.stringify(screen)}</pre>
      </div>
    </div>
  );
}
