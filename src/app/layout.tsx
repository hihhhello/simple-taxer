import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata, Viewport } from 'next';
import { ToastContainer } from 'react-toastify';

import { QueryClientProvider } from '@/features/QueryClientProvider';
import { BaseLayout } from '@/app/_ui/BaseLayout';
import { NextAuthProvider } from '@/app/_ui/NextAuthProvider';
import { Outfit } from 'next/font/google';
import { classNames } from '@/shared/utils/helpers';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: 'Simple Taxer | %s',
    default: 'Simple Taxer',
  },
  description: 'Created by Anton',
  openGraph: {
    title: 'Simple Taxer',
    description: 'Get your taxes in a seconds',
    url: 'https://simple-taxer.vercel.app/',
    siteName: 'Simple Taxer',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/preview.png',
        width: 800,
        height: 600,
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={classNames('h-full bg-primary-background', outfit.className)}
      lang="en"
    >
      <body className="h-full">
        <QueryClientProvider>
          <ToastContainer />

          <NextAuthProvider>
            <BaseLayout>{children}</BaseLayout>
          </NextAuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
