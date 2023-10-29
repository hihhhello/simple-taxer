import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';
import { Navbar } from './Navbar/Navbar';
import { createAuthorizedCaller } from '@/server/routers/_app';
import { calculateTotalIncome, formatUSDInteger } from '@/shared/utils/helpers';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = async ({ children }: BaseLayoutProps) => {
  const caller = await createAuthorizedCaller();

  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  const transactions = await caller.transactions.getAll({});

  const totalIncome = calculateTotalIncome(transactions?.data);

  return (
    <div className="relative min-h-full px-4 pt-4 sm:px-[220px] sm:pt-1">
      <div className="fixed right-0 top-[116px] flex flex-col rounded-l-2xl bg-primary-light-blue py-4 pl-6 pr-9 font-semibold text-white">
        <span>Total Income</span>

        <span className="text-3xl">{formatUSDInteger(totalIncome)}</span>
      </div>

      <div className="container mx-auto">
        <div>
          <Navbar me={session?.user} />

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};
