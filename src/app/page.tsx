import { getServerSession } from 'next-auth';

import { createAuthorizedCaller } from '@/server';
import { HomePageContent } from '@/app/_ui/HomePage/HomePage';
import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';
import { Metadata } from 'next';

export default async function Home() {
  const caller = await createAuthorizedCaller();

  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  const transactions = await caller.transactions.getAll({});
  const sourceIncomes = await caller.transactions.getBySourceName({});

  return (
    <>
      <HomePageContent
        transactions={transactions}
        session={session}
        sourceIncomes={sourceIncomes}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: 'Simple Taxer | Home',
};
