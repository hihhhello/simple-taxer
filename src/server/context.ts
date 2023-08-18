import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getServerSession } from 'next-auth';

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';

import { prisma } from '@/server/prisma';

export const createTRPCContext = async (_opts: FetchCreateContextFnOptions) => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  return {
    user: session?.user,
    prisma,
  };
};
