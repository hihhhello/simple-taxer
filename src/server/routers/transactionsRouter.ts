import { z } from 'zod';

import { publicProcedure, router } from '../trpc';
import { ZOD_SORTING_ENUM } from '../utils/serverConstants';

export const transactionsRouter = router({
  getAll: publicProcedure
    .input(
      z
        .object({
          sort: z
            .object({
              amount: ZOD_SORTING_ENUM,
              bankName: ZOD_SORTING_ENUM,
              sourceName: ZOD_SORTING_ENUM,
              date: ZOD_SORTING_ENUM,
            })
            .optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      if (!ctx.user) {
        return;
      }

      return ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.user.id,
        },
        orderBy: {
          date: 'desc',
          ...input?.sort,
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
