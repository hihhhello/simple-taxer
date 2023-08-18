import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const transactionsRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    if (!ctx.user) {
      return;
    }

    return ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        bankName: z.string().optional(),
        sourceName: z.string().optional(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        return;
      }

      const newTransaction = await ctx.prisma.transaction.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });

      return newTransaction;
    }),

  delete: publicProcedure
    .input(
      z.object({
        transactionId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.transaction.delete({
        where: {
          id: input.transactionId,
        },
      });
    }),
});
