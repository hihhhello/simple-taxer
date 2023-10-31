'use client';

import { formatUSDInteger } from '@/shared/utils/helpers';
import { useIsDesktop } from '@/shared/utils/hooks';

type TotalIncomeWidgetProps = {
  totalIncome: number;
};

export const TotalIncomeWidget = ({ totalIncome }: TotalIncomeWidgetProps) => {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <div className="fixed right-0 top-[116px] flex flex-col rounded-l-2xl bg-primary-light-blue py-4 pl-6 pr-9 font-semibold text-white">
        <span>Total Income</span>

        <span className="text-3xl">{formatUSDInteger(totalIncome)}</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-2 left-0 flex items-center gap-1 rounded-r-lg bg-primary-light-blue p-2 pl-4 font-semibold text-white">
      <div className="flex items-center gap-1">
        <span className="text-sm">Total Income:</span>

        <span className="text-xl">{formatUSDInteger(totalIncome)}</span>
      </div>
    </div>
  );
};
