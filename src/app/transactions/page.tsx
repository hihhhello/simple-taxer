import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

import { TransactionsPageContent } from './_ui/TransactionsPageContent';
import { createAuthorizedCaller } from '@/server';
import { NEXT_AUTH_OPTIONS } from '../api/auth/[...nextauth]/route';
import { startOfYear } from 'date-fns';

const TransactionsPage = async () => {
  const caller = await createAuthorizedCaller();

  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  const transactions = await caller.transactions.getAll({
    startDate: startOfYear(new Date()),
  });

  return (
    <TransactionsPageContent me={session?.user} transactions={transactions} />
  );
};

export const metadata: Metadata = {
  title: 'Transactions',
};

export default TransactionsPage;
