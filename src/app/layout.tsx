import { QueryClientProvider } from '@/features/QueryClientProvider';
import './globals.css';
import type { Metadata } from 'next';
import { BaseLayout } from '@/app/_ui/BaseLayout';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Simple Taxer',
  description: 'Created by Anton',
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full" lang="en">
      <body className="h-full">
        <QueryClientProvider>
          <ToastContainer />

          <BaseLayout>{children}</BaseLayout>
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
