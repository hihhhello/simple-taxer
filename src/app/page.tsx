import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import { upperFirst } from 'lodash';

import { createAuthorizedCaller } from '@/server';
import { HomePageContent } from '@/app/_ui/HomePage/HomePage';
import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';
import {
  HomePageTab,
  HomePageTabKey,
} from './_ui/HomePage/utils/homePageTypes';
import { HOME_PAGE_TAB_KEY_TO_OPEN_GRAPH_DESCRIPTION } from './_ui/HomePage/utils/homePageConstants';

type HomeProps = {
  searchParams: {
    tab?: HomePageTab;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  const caller = await createAuthorizedCaller();

  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  const transactions = await caller.transactions.getAll({});
  const sourceIncomes = await caller.transactions.getBySourceName({});

  return (
    <>
      <HomePageContent
        transactions={transactions}
        session={session}
        sourceIncomes={sourceIncomes}
        tab={searchParams.tab}
      />
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  return {
    title: `Simple Taxer | ${upperFirst(searchParams.tab) ?? 'Transactions'}`,
    openGraph: {
      description:
        HOME_PAGE_TAB_KEY_TO_OPEN_GRAPH_DESCRIPTION[
          searchParams.tab ?? HomePageTabKey.TRANSACTIONS
        ],
    },
  };
}
