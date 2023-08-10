import { appRouter, prisma } from '@/server';
import { HomePageContent } from '@/app/_ui/HomePage';

export default async function Home() {
  const caller = appRouter.createCaller({
    prisma,
  });

  const transactions = await caller.transactions.getAll();

  return (
    <>
      <HomePageContent transactions={transactions} />
    </>
  );
}
