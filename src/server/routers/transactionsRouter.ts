import { z } from 'zod';
import { omit } from 'lodash';
import { Prisma } from '@prisma/client';

import { TransactionSortField } from '@/shared/types/transactionTypes';
import { SortOrder } from '@/shared/types/types';

import { publicProcedure, router } from '../trpc';

const SortString = z.union([
  z.literal('amount:asc'),
  z.literal('amount:desc'),
  z.literal('bankName:asc'),
  z.literal('bankName:desc'),
  z.literal('sourceName:asc'),
  z.literal('sourceName:desc'),
  z.literal('date:asc'),
  z.literal('date:desc'),
]);

export const transactionsRouter = router({
  getAll: publicProcedure
    .input(
      z
        .object({
          sort: SortString.optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          offset: z.number().optional(),
          limit: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        return;
      }

      const sortBy = input?.sort
        ? (input?.sort?.split(':') as [TransactionSortField, SortOrder])
        : undefined;

      const transactions = await ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.user.id,
          date: {
            gte: input?.startDate,
            lte: input?.endDate,
          },
        },
        orderBy: sortBy
          ? {
              [sortBy[0]]: sortBy[1],
            }
          : {
              date: 'desc',
            },
        skip: input?.offset,
        take: input?.limit,
      });

      /**
       * TODO: Remove when an official solution is released.
       *
       * @See https://github.com/prisma/prisma/issues/7550.
       */
      const transactionsCount = await ctx.prisma.transaction.count({
        where: {
          userId: ctx.user.id,
        },
      });

      return {
        data: transactions,
        offset: input?.offset,
        limit: input?.limit,
        total: transactionsCount,
      };
    }),
  getOneById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        return;
      }

      const transaction = await ctx.prisma.transaction.findFirst({
        where: {
          userId: ctx.user.id,
          id: input.id,
        },
      });

      return {
        data: transaction,
      };
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

      return {
        data: newTransaction,
      };
    }),
  createMany: publicProcedure
    .input(
      z.array(
        z.object({
          amount: z.number(),
          bankName: z.string().optional().nullable(),
          sourceName: z.string().optional().nullable(),
          date: z.date(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      if (!user) {
        return;
      }

      const transactionsWithUser = input.map<Prisma.TransactionCreateManyInput>(
        (transaction) => ({ ...transaction, userId: user.id }),
      );

      const newTransactions = await ctx.prisma.transaction.createMany({
        data: transactionsWithUser,
      });

      return {
        data: newTransactions,
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        transactionId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedTransaction = await ctx.prisma.transaction.delete({
        where: {
          id: input.transactionId,
        },
      });

      return {
        data: deletedTransaction,
      };
    }),
  deleteMany: publicProcedure
    .input(
      z.object({
        transactionIds: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedTransactions = await ctx.prisma.transaction.deleteMany({
        where: {
          id: {
            in: input.transactionIds,
          },
        },
      });

      return {
        data: deletedTransactions,
      };
    }),
  edit: publicProcedure
    .input(
      z.object({
        newValues: z.object({
          amount: z.number().optional(),
          bankName: z.string().optional().nullable(),
          sourceName: z.string().optional().nullable(),
          date: z.date().optional(),
        }),
        transactionId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      if (!user) {
        return;
      }

      const editedTransactions = await ctx.prisma.transaction.update({
        where: {
          id: input.transactionId,
        },
        data: input.newValues,
      });

      return {
        data: editedTransactions,
      };
    }),
  duplicate: publicProcedure
    .input(
      z.object({
        transactionId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      if (!user) {
        return;
      }

      const transactionToDuplicate = await ctx.prisma.transaction.findUnique({
        where: {
          id: input.transactionId,
        },
      });

      if (!transactionToDuplicate) {
        throw new Error('Transaction to duplicate not found.');
      }

      const duplicatedTransaction = await ctx.prisma.transaction.create({
        data: omit(transactionToDuplicate, 'id'),
      });

      return {
        data: duplicatedTransaction,
      };
    }),
  getBySourceName: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      if (!ctx.user) {
        return;
      }

      const transactionsBySourceName = await ctx.prisma.transaction.groupBy({
        by: ['sourceName'],
        where: {
          userId: ctx.user.id,
        },
        _sum: {
          amount: true,
        },
      });

      return {
        data: transactionsBySourceName,
      };
    }),

  getByDate: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    if (!ctx.user) {
      return;
    }

    const transactionsByDate = await ctx.prisma.transaction.groupBy({
      by: ['date'],
      where: {
        userId: ctx.user.id,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      data: transactionsByDate,
    };
  }),
});
