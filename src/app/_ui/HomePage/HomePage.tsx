'use client';

import { useCallback, useMemo, useState } from 'react';
import { Session, User } from 'next-auth';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { formatToUSDCurrency } from '@/shared/utils';
import { api } from '@/shared/api';
import { IncomeTaxCalculator } from '@/features/IncomeTaxCalculator';
import { HomePageTabBar } from './ui/HomePageTabBar';
import { HomePageTab, HomePageTabKey } from './utils/homePageTypes';
import { HomePageTransactionsTab } from './ui/HomePageTransactionsTab';
import { HomePageAnalyticsTab } from './ui/HomePageAnalyticsTab';

type HomePageContentProps = {
  transactions: ApiRouterOutputs['transactions']['getAll'];
  sourceIncomes: ApiRouterOutputs['transactions']['getBySourceName'];
  session: Session | null;
  tab?: HomePageTab;
};

const getCurrentTab = (
  tab: HomePageTab | undefined,
  me: User | undefined | null,
) => {
  if (!tab && !me) {
    return HomePageTabKey.CALCULATOR;
  }

  if (!tab) {
    return HomePageTabKey.TRANSACTIONS;
  }

  return tab;
};

export const HomePageContent = ({
  transactions: initialTransactions,
  sourceIncomes: initialSourceIncomes,
  tab: initialTab,
  session,
}: HomePageContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: transactions } = api.transactions.getAll.useQuery(
    {},
    {
      initialData: initialTransactions,
    },
  );

  const [currentTab, setCurrentTab] = useState<HomePageTab>(
    getCurrentTab(initialTab, session?.user),
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

  const handleSelectTab = useCallback(
    (selectedTab: HomePageTab) => {
      setCurrentTab(selectedTab);

      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', selectedTab);

      router.push(pathname + '?' + params.toString());
    },
    [pathname, router, searchParams],
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
        handleSelectTab={handleSelectTab}
        className="mb-4"
      />

      {(() => {
        if (currentTab === HomePageTabKey.TRANSACTIONS) {
          return (
            <HomePageTransactionsTab
              me={session?.user}
              transactions={initialTransactions}
            />
          );
        }

        if (currentTab === HomePageTabKey.ANALYTICS) {
          return (
            <HomePageAnalyticsTab
              me={session?.user}
              sourceIncomes={initialSourceIncomes}
            />
          );
        }

        if (currentTab === HomePageTabKey.CALCULATOR) {
          return (
            <IncomeTaxCalculator totalIncome={totalIncome} me={session?.user} />
          );
        }

        return null;
      })()}
    </div>
  );
};
