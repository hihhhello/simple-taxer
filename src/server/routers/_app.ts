import { getServerSession } from 'next-auth';

import { router } from '@/server/trpc';
import { transactionsRouter } from './transactionsRouter';
import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/server';

export const appRouter = router({
  transactions: transactionsRouter,
});

export type AppRouter = typeof appRouter;

export const createAuthorizedCaller = async () => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  return appRouter.createCaller({
    prisma,
    user: session?.user,
  });
};
