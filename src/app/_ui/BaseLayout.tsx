import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';
import { Navbar } from './Navbar/Navbar';
import { createAuthorizedCaller } from '@/server/routers/_app';
import { calculateTotalIncome } from '@/shared/utils/helpers';
import { TotalIncomeWidget } from './TotalIncomeWidget';

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
      <TotalIncomeWidget totalIncome={totalIncome} />

      <div className="container mx-auto">
        <div>
          <Navbar me={session?.user} />

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};
