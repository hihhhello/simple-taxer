import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const transactionsRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany();
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
      const newTransaction = await ctx.prisma.transaction.create({
        data: {
          ...input,
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
