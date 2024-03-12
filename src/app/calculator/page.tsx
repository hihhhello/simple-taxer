import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

import { CalculatorPageContent } from './_ui/CalculatorPageContent';
import { createAuthorizedCaller } from '@/server';
import { NEXT_AUTH_OPTIONS } from '@/shared/utils/nextAuth';

const CalculatorPage = async () => {
  const caller = await createAuthorizedCaller();

  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  const transactions = await caller.transactions.getAll({});

  return (
    <CalculatorPageContent me={session?.user} transactions={transactions} />
  );
};

export const metadata: Metadata = {
  title: 'Calculator',
};

export default CalculatorPage;
