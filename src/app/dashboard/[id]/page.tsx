import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/types/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const screenId = params.id;
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: screen } = await supabase.from('screens').select('*').eq('id', screenId).single();

  return {
    title: `${screen?.name} - Handover`,
  };
}

export default async function ScreenPage({ params }: { params: { id: number } }) {
  const screenId = params.id || 0;
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: screen } = await supabase.from('screens').select('*').eq('id', screenId).single();
  const { data: version } = await supabase
    .from('screens')
    .select('version, changes')
    .eq('name', screen?.name)
    .order('version', { ascending: false });

  console.log(version);
  console.log(screen?.html_file);

  return (
    <div className="px-14 py-8">
      <div className="flex h-10 items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Suspense fallback={<Skeleton />}>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{screen?.name}</h3>
        </Suspense>
      </div>
      <hr className="my-8" />
      <Suspense fallback={<Skeleton />}>
        <div className="flex items-center justify-between">
          <div
            className="h-96 w-96"
            dangerouslySetInnerHTML={{ __html: screen?.html_file as string }}
          />
          <ScrollArea className="h-96 w-60 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">Changes:</h4>
              {version?.map((v) => (
                <p>
                  {v.version} - {v.changes}
                </p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Suspense>
    </div>
  );
}
