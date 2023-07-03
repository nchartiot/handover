import './globals.css';

import { Analytics } from '@vercel/analytics/react';

import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata = {
  title: 'Handover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-w-screen flex flex-col">
          <ThemeProvider attribute="class" defaultTheme="light">
            <SiteHeader />
            {children}
            <Analytics />
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
