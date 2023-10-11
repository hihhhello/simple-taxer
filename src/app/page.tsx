import { getServerSession } from 'next-auth';

import { createAuthorizedCaller } from '@/server';
import { HomePageContent } from '@/app/_ui/HomePage/HomePage';
import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';

export default async function Home() {
  const caller = await createAuthorizedCaller();

  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  const transactions = await caller.transactions.getAll({});

  return (
    <>
      <HomePageContent transactions={transactions} session={session} />
    </>
  );
}
