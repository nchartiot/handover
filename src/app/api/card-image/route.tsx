// // App router includes @vercel/og.
// // No need to install it.
// // export const runtime = 'edge';
// // TODO: Duplicate or move this file outside the `_examples` folder to make it a route
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { ImageResponse } from 'next/server';
// import { NextResponse } from 'next/server';

// import { Database } from '@/types/supabase';

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const screenId = searchParams.get('id') || 0;

//     // Create a Supabase client configured to use cookies
//     const supabase = createRouteHandlerClient<Database>({ cookies });

//     // This assumes you have a `todos` table in Supabase. Check out
//     // the `Create Table and seed with data` section of the README 👇
//     // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
//     const { data } = await supabase.from('screens').select('html_file').eq('id', screenId);

//     if (!data) throw new Error('could not find data');

//     const htmlFile = data[0].html_file;

//     return new ImageResponse(<div className="h-8 w-8 bg-red-500" />, {
//       width: 1200,
//       height: 630,
//     });
//   } catch (e: any) {
//     console.log(`${e.message}`);
//     return new Response(`Failed to generate the image`, {
//       status: 500,
//     });
//   }
// }
