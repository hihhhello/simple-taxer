import { z } from 'zod';
import { publicProcedure, router } from '@/server/trpc';

export const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query((opts) => {
      const { input } = opts;

      return `Hello ${input.name}` as const;
    }),
});

export type AppRouter = typeof appRouter;
