import { z } from 'zod';

import { publicProcedure, router } from '../trpc';
import { ZOD_SORTING_ENUM } from '../utils/serverConstants';
import { Prisma } from '@prisma/client';

function parseCSV(csvContent: string) {
  // Split the CSV content into lines
  const lines = csvContent.split('\n');

  // Initialize an array to store the parsed data
  const data = [];

  // Iterate through each line and split it into individual values
  for (const line of lines) {
    const values = line.split(',');
    data.push(values);
  }

  // Now 'data' contains the parsed CSV data as a 2D array
  console.log(data);

  // You can further process or display the data as needed
}

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

      return newTransactions;
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

      return ctx.prisma.transaction.update({
        where: {
          id: input.transactionId,
        },
        data: input.newValues,
      });
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
        data: {
          amount: transactionToDuplicate.amount,
          date: new Date(),
          bankName: transactionToDuplicate.bankName,
          sourceName: transactionToDuplicate.sourceName,
          userId: transactionToDuplicate.userId,
        },
      });

      return duplicatedTransaction;
    }),
});
