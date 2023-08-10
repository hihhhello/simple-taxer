import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/server';

export {};

declare global {
  type ApiRouterInputs = inferRouterInputs<AppRouter>;
  type ApiRouterOutputs = inferRouterOutputs<AppRouter>;
}
