'use client';

import { User } from 'next-auth';

import { GoogleSignInButton } from '@/features/GoogleSignInButton';
import { AnalyticsIncomeBySourcePieChart } from '@/app/analytics/_ui/AnalyticsIncomeBySourcePieChart';
import { AnalyticsSourceIncome } from '@/shared/types/analyticsTypes';
import { api } from '@/shared/api';
import { AnalyticsPageLogInCard } from './AnalyticsPageLogInCard';
import { Breakpoints, useIsBreakpoint } from '@/shared/utils/hooks';
import { PieChartHeroIllustrationDesktop } from '@/shared/illustartions/PieChartHeroIllustrationDesktop';
import { useEffect } from 'react';

type AnalyticsPageContentProps = {
  me: User | undefined | null;
  sourceIncomes:
    | {
        data: AnalyticsSourceIncome[];
      }
    | undefined;
};

export const AnalyticsPageContent = ({
  me,
  sourceIncomes: initialSourceIncomes,
}: AnalyticsPageContentProps) => {
  const isDesktop = useIsBreakpoint(Breakpoints.SM);

  const { data: transactionsBySourceName } =
    api.transactions.getBySourceName.useQuery(
      {},
      { initialData: initialSourceIncomes },
    );

  const { data: transactionsByDate } = api.transactions.getByDate.useQuery({});

  console.log(transactionsByDate);

  if (!me) {
    return (
      <div className="mx-auto max-w-4xl pt-16">
        <AnalyticsPageLogInCard />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12 flex flex-col gap-6 sm:flex-row">
        <div className="justify-space-between flex items-center gap-12 rounded-2xl bg-white px-6 py-4">
          <div>
            <p className="text-3xl font-semibold leading-tight text-primary-blue sm:text-5xl">
              Be Smart
            </p>
            <p className="text-3xl font-semibold leading-tight text-primary-green sm:text-5xl">
              Use
            </p>
            <p className="text-3xl font-semibold leading-tight text-primary-blue sm:text-5xl">
              Graph
            </p>
          </div>

          {isDesktop && (
            <div>
              <PieChartHeroIllustrationDesktop />
            </div>
          )}
        </div>
      </div>

      {transactionsBySourceName && (
        <AnalyticsIncomeBySourcePieChart
          transactionsBySourceName={transactionsBySourceName.data}
        />
      )}
    </div>
  );
};
