import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

import { QueryClientProvider } from '@/features/QueryClientProvider';
import { BaseLayout } from '@/app/_ui/BaseLayout';
import { NextAuthProvider } from '@/app/_ui/NextAuthProvider';

export const metadata: Metadata = {
  title: {
    template: 'Simple Taxer | %s',
    default: 'Simple Taxer',
  },
  description: 'Created by Anton',
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full" lang="en">
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
