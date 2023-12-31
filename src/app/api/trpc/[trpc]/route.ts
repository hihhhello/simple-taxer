import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createTRPCContext } from '@/server/context';

// this is the server RPC API handler

const handler = (request: Request) => {
  console.log(`incoming request ${request.url}`);

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: createTRPCContext,
  });
};

export const GET = handler;
export const POST = handler;
