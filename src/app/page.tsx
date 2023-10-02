import { createAuthorizedCaller } from '@/server';
import { HomePageContent } from '@/app/_ui/HomePage/HomePage';

export default async function Home() {
  const caller = await createAuthorizedCaller();

  const transactions = await caller.transactions.getAll({});

  return (
    <>
      <HomePageContent transactions={transactions} />
    </>
  );
}
