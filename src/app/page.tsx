import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { HeroImage } from '@/components/hero-image';
import { LoginDialog } from '@/components/login-dialog';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  return (
    <div className="">
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
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Data to enrich your online business
              </h1>
              <p className="mt-6 text-lg leading-8">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
                fugiat aliqua.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {user ? <p>Welcome {user.email}</p> : <LoginDialog />}
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

// import { cookies } from 'next/headers';
// import Balancer from 'react-wrap-balancer';

// import { Icons } from '@/components/icons';
// import { LoginDialog } from '@/components/login-dialog';
// import { SiteFooter } from '@/components/site-footer';

// export default async function Home() {
//   const supabase = createServerComponentClient({ cookies });
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   return (
//     <section className="flex h-full flex-1 flex-col">
//       <div className="relative isolate h-full flex-1 overflow-hidden">
//         <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
//           <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
//             <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-6xl">
//               Endless art, <br /> one Frame
//             </h1>
//             <p className="mt-6 text-lg leading-8">
//               <Balancer>
//                 Bring an infinite gallery to your desk and easily update your
//                 curated collection of arts, quotes and photos. The Frame is
//                 designed for the modern minimalist.
//               </Balancer>
//             </p>
//             <div className="mt-10 flex items-center gap-x-6">
//               {user ? <p>Welcome {user.email}</p> : <LoginDialog />}
//               <a
//                 href="#"
//                 className="flex items-center gap-1 text-sm font-semibold leading-6"
//               >
//                 Learn more <Icons.arrowRight className="h-3 w-3" />
//               </a>
//             </div>
//           </div>
//           <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
//             <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
//               <img
//                 src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
//                 alt="App screenshot"
//                 width={2432}
//                 height={1442}
//                 className="w-[76rem] rounded-md  shadow-2xl ring-1 ring-white/10"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <SiteFooter />
//     </section>
//   );
// }
