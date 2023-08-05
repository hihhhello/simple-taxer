import type { AppRouter } from '@/server/routers/_app';
import { createTRPCReact } from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const trpc = createTRPCReact<AppRouter>();

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
