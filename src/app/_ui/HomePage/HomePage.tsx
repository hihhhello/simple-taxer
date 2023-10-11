'use client';

import { useMemo, useState } from 'react';
import { Session } from 'next-auth';

import { formatToUSDCurrency } from '@/shared/utils';
import { api } from '@/shared/api';
import { IncomeTaxCalculator } from '@/features/IncomeTaxCalculator';
import { HomePageTabBar } from './ui/HomePageTabBar';
import { HomePageTab } from './utils/homePageTypes';
import { IncomeBySourcePieChart } from '@/features/IncomeBySourcePieChart';
import { GoogleSignInButton } from '@/features/GoogleSignInButton';
import { HomePageTransactionsTab } from './ui/HomePageTransactionsTab';

type HomePageContentProps = {
  transactions: ApiRouterOutputs['transactions']['getAll'];
  session: Session | null;
};

export const HomePageContent = ({
  transactions: initialTransactions,
  session,
}: HomePageContentProps) => {
  const { data: transactions } = api.transactions.getAll.useQuery(
    {},
    {
      initialData: initialTransactions,
    },
  );
  const { data: transactionsBySourceName } =
    api.transactions.getBySourceName.useQuery({});

  const [currentTab, setCurrentTab] = useState<HomePageTab>(
    session?.user ? HomePageTab.TRANSACTIONS : HomePageTab.CALCULATOR,
  );

  const totalIncome = useMemo(
    () =>
      transactions
        ? transactions.reduce((totalIncomeAccumulator, transaction) => {
            if (transaction.amount > 0) {
              return totalIncomeAccumulator + transaction.amount;
            }

            return totalIncomeAccumulator;
          }, 0)
        : 0,
    [transactions],
  );

  return (
    <div>
      {session?.user && (
        <div className="mb-4">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:col-start-2 sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Total Income
              </dt>

              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {formatToUSDCurrency(totalIncome)}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <HomePageTabBar
        currentTab={currentTab}
        handleSelectTab={setCurrentTab}
        className="mb-4"
      />

      {(() => {
        if (currentTab === HomePageTab.TRANSACTIONS) {
          return (
            <HomePageTransactionsTab
              me={session?.user}
              transactions={initialTransactions}
            />
          );
        }

        if (currentTab === HomePageTab.ANALYTICS) {
          if (!session?.user) {
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
        }

        if (currentTab === HomePageTab.CALCULATOR) {
          return (
            <div>
              <IncomeTaxCalculator
                totalIncome={totalIncome}
                me={session?.user}
              />
            </div>
          );
        }

        return null;
      })()}
    </div>
  );
};
