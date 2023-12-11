import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';
import { Navbar } from './Navbar/Navbar';
import { createAuthorizedCaller } from '@/server/routers/_app';
import { TotalIncomeWidget } from './TotalIncomeWidget';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = async ({ children }: BaseLayoutProps) => {
  const caller = await createAuthorizedCaller();

  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  const transactions = await caller.transactions.getAll({});

  return (
    <div className="relative min-h-full px-4 pt-4 sm:px-[220px] sm:pt-1">
      {session?.user && <TotalIncomeWidget transactions={transactions} />}

      <div className="container mx-auto">
        <div>
          <Navbar me={session?.user} />

          <main className="pb-10 pt-8">{children}</main>
        </div>
      </div>
    </div>
  );
};
