'use client';

import { useMemo, useState } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

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

  const handleCopyTotalIncome = () => {
    navigator.clipboard.writeText(totalIncome.toString());

    toast.success('Total income copied to clipboard.', {
      autoClose: 1500,
    });
  };

  return (
    <>
      <div className="fixed right-0 top-[116px] z-50 hidden flex-col rounded-l-2xl bg-primary-light-blue py-4 pl-6 pr-9 font-semibold text-white sm:flex">
        <span>Total Income</span>

        <div
          onClick={handleCopyTotalIncome}
          className="flex cursor-pointer items-center justify-start"
        >
          <span className="text-3xl">{formatUSDInteger(totalIncome)}</span>

          <DocumentDuplicateIcon width={16} height={16} />
        </div>
      </div>

      <div
        className={classNames(
          'fixed bottom-2 left-0 z-50 flex transform items-center gap-2 rounded-r-lg bg-primary-light-blue py-2 pl-4 pr-1 font-semibold text-white transition duration-300 ease-in-out sm:hidden',
          !isWidgetOpen && '-translate-x-[85%]',
        )}
      >
        <div className="flex items-center gap-1">
          <span className="text-sm">Total Income:</span>

          <div
            onClick={handleCopyTotalIncome}
            className="flex cursor-pointer items-center justify-start"
          >
            <span className="text-xl">{formatUSDInteger(totalIncome)}</span>

            <DocumentDuplicateIcon width={16} height={16} />
          </div>
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
