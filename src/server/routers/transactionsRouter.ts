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
  getOneById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      if (!ctx.user) {
        return;
      }

      return ctx.prisma.transaction.findFirst({
        where: {
          userId: ctx.user.id,
          id: input.id,
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
  deleteMany: publicProcedure
    .input(
      z.object({
        transactionIds: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.transaction.deleteMany({
        where: {
          id: {
            in: input.transactionIds,
          },
        },
      });
    }),
});
