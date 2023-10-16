import { getServerSession } from 'next-auth';
import { Metadata } from 'next';

import { createAuthorizedCaller } from '@/server';
import { HomePageContent } from '@/app/_ui/HomePage/HomePage';
import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';
import {
  HomePageTab,
  HomePageTabKey,
} from './_ui/HomePage/utils/homePageTypes';

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

  console.log('searchParams', searchParams.tab);

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

export const metadata: Metadata = {
  title: 'Simple Taxer | Home',
};
