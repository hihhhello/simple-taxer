import { TransactionsTable } from '@/features/TransactionsTable';
import { prisma } from '@/server/prisma';
import { appRouter } from '@/server/routers/_app';

export default async function Home() {
  const caller = appRouter.createCaller({
    prisma,
  });

  const transactions = await caller.transactions.getAll();

  return (
    <>
      <TransactionsTable transactions={transactions} />
    </>
  );
}
