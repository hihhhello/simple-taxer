'use client';

import { useMemo } from 'react';
import { User } from 'next-auth';

import { IncomeTaxCalculator } from '@/features/IncomeTaxCalculator/IncomeTaxCalculator';
import { api } from '@/shared/api';
import { calculateTotalIncome } from '@/shared/utils/helpers';

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
    () => calculateTotalIncome(transactions?.data),
    [transactions],
  );

  return <IncomeTaxCalculator totalIncome={totalIncome} me={me} />;
};
