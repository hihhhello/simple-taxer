'use client';

import { useMemo } from 'react';
import { User } from 'next-auth';

import { IncomeTaxCalculator } from '@/features/IncomeTaxCalculator/IncomeTaxCalculator';
import { api } from '@/shared/api';

type CalculatorPageContentProps = {
  transactions: ApiRouterOutputs['transactions']['getAll'];
  me: User | undefined | null;
};

export const CalculatorPageContent = ({
  transactions: initialTransactions,
  me,
}: CalculatorPageContentProps) => {
  const { data: transactions } = api.transactions.getAll.useQuery(
    {},
    {
      initialData: initialTransactions,
    },
  );

  const totalIncome = useMemo(
    () =>
      transactions?.data
        ? transactions.data?.reduce((totalIncomeAccumulator, transaction) => {
            if (transaction.amount > 0) {
              return totalIncomeAccumulator + transaction.amount;
            }

            return totalIncomeAccumulator;
          }, 0)
        : 0,
    [transactions],
  );

  return <IncomeTaxCalculator totalIncome={totalIncome} me={me} />;
};
