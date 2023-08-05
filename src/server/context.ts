import * as trpc from '@trpc/server';
import { prisma } from '@/server/prisma';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export const createTRPCContext = (_opts: FetchCreateContextFnOptions) => {
  return {
    prisma,
  };
};
