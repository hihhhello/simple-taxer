import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';

import { NEXT_AUTH_OPTIONS } from '../api/auth/[...nextauth]/route';
import { Topbar } from './Topbar';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = async ({ children }: BaseLayoutProps) => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  return (
    <div className="min-h-full">
      <Topbar session={session} />

      <div className="px-4 pt-10 sm:px-0">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
