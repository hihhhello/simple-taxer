import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

import { AnalyticsPageContent } from './_ui/AnalyticsPageContent';
import { createAuthorizedCaller } from '@/server';
import { NEXT_AUTH_OPTIONS } from '../api/auth/[...nextauth]/route';

const AnalyticsPage = async () => {
  const caller = await createAuthorizedCaller();

  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  const sourceIncomes = await caller.transactions.getBySourceName({});

  return (
    <AnalyticsPageContent me={session?.user} sourceIncomes={sourceIncomes} />
  );
};

export const metadata: Metadata = {
  title: 'Analytics',
};

export default AnalyticsPage;
