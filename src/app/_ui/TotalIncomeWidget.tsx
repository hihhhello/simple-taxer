'use client';

import { formatUSDInteger } from '@/shared/utils/helpers';

type TotalIncomeWidgetProps = {
  totalIncome: number;
};

export const TotalIncomeWidget = ({ totalIncome }: TotalIncomeWidgetProps) => {
  return (
    <div className="fixed right-0 top-[116px] hidden flex-col rounded-l-2xl bg-primary-light-blue py-4 pl-6 pr-9 font-semibold text-white sm:flex">
      <span>Total Income</span>

      <span className="text-3xl">{formatUSDInteger(totalIncome)}</span>
    </div>
  );
};
