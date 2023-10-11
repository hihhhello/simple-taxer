'use client';

import { User } from 'next-auth';

import { GoogleSignInButton } from '@/features/GoogleSignInButton';
import { IncomeBySourcePieChart } from '@/features/IncomeBySourcePieChart';
import { AnalyticsSourceIncome } from '@/shared/types/analyticsTypes';

type HomePageAnalyticsTabProps = {
  me: User | undefined | null;
  transactionsBySourceName: AnalyticsSourceIncome[];
};

export const HomePageAnalyticsTab = ({
  me,
  transactionsBySourceName,
}: HomePageAnalyticsTabProps) => {
  if (!me) {
    return <GoogleSignInButton />;
  }

  if (!transactionsBySourceName) {
    return null;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-bold leading-6 text-gray-900">
          Income by source
        </h1>
      </div>

      <IncomeBySourcePieChart
        transactionsBySourceName={transactionsBySourceName}
      />
    </div>
  );
};
