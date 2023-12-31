import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';

import { CommentSection } from '@/components/comment-section';
import { StylesRenderer } from '@/components/styles-renderer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/types/supabase';

import { ScreenRenderer } from '../../../components/screen-renderer';

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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: screen } = await supabase.from('screens').select('*').eq('id', screenId).single();
  const { data: pastScreens } = await supabase
    .from('screens')
    .select('id, version, changes, is_svg')
    .eq('name', screen?.name)
    .order('version', { ascending: false });

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
        <div className="flex flex-col gap-12">
          <div className="flex h-[720px] flex-col items-center justify-between gap-4 xl:flex-row">
            <div className="h-[720px] w-[1080px] max-w-7xl flex-1">
              {screen && <ScreenRenderer htmlString={screen?.html_file} isSvg={screen.is_svg} />}
            </div>
            <div className="flex flex-col gap-2">
              <StylesRenderer />
              <ScrollArea className="h-96 rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">Changes:</h4>
                  <ul>
                    {pastScreens?.map((screen) => (
                      <li key={screen.id}>
                        <Link href={`/dashboard/${screen.id}`}>
                          {screen.version} - {screen.changes}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
            </div>
          </div>
          {screen && user && <CommentSection screenId={screen.id} userId={user.id} />}
        </div>
      </Suspense>
    </div>
  );
}
