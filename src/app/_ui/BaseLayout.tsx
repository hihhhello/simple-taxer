import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';
import { Navbar } from './Navbar';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = async ({ children }: BaseLayoutProps) => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  return (
    <div className="min-h-full px-4  pt-1 sm:px-[220px]">
      <div className="container mx-auto">
        <div>
          <Navbar me={session?.user} />

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};
