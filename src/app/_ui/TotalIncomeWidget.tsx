'use client';

import { useMemo, useState } from 'react';

import { ChevronLeftIcon } from '@/shared/icons/ChevronLeftIcon';
import {
  calculateTotalIncome,
  classNames,
  formatUSDInteger,
} from '@/shared/utils/helpers';
import { api } from '@/shared/api';

type TotalIncomeWidgetProps = {
  transactions: ApiRouterOutputs['transactions']['getAll'];
};

export const TotalIncomeWidget = ({
  transactions: initialTransactions,
}: TotalIncomeWidgetProps) => {
  const { data: transactions } = api.transactions.getAll.useQuery(
    {},
    {
      initialData: initialTransactions,
    },
  );

  const [isWidgetOpen, setIsWidgetOpen] = useState(true);

  const totalIncome = useMemo(
    () => calculateTotalIncome(transactions?.data),
    [transactions?.data],
  );

  return (
    <>
      <div className="fixed right-0 top-[116px] z-50 hidden flex-col rounded-l-2xl bg-primary-light-blue py-4 pl-6 pr-9 font-semibold text-white sm:flex">
        <span>Total Income</span>

        <span className="text-3xl">{formatUSDInteger(totalIncome)}</span>
      </div>

      <div
        className={classNames(
          'fixed bottom-2 left-0 z-50 flex transform items-center gap-2 rounded-r-lg bg-primary-light-blue py-2 pl-4 pr-1 font-semibold text-white transition duration-300 ease-in-out sm:hidden',
          !isWidgetOpen && '-translate-x-[85%]',
        )}
      >
        <div className="flex items-center gap-1">
          <span className="text-sm">Total Income:</span>

          <span className="text-xl">{formatUSDInteger(totalIncome)}</span>
        </div>

        <button onClick={() => setIsWidgetOpen((prev) => !prev)}>
          <ChevronLeftIcon
            className={classNames(!isWidgetOpen && 'rotate-180')}
          />
        </button>
      </div>
    </>
  );
};
