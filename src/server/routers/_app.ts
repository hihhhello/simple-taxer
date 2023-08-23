import { getServerSession } from 'next-auth';

import { router } from '@/server/trpc';
import { transactionsRouter } from './transactions';
import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/server';
import { UseTRPCQueryResult } from '@trpc/react-query/shared';

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

type test = UseTRPCQueryResult<
  ApiRouterOutputs['transactions']['getOne'],
  unknown
>;
