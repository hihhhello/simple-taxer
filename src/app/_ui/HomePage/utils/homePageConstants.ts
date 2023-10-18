import { HomePageTab, HomePageTabKey } from './homePageTypes';

export const HOME_PAGE_TAB_KEY_TO_OPEN_GRAPH_DESCRIPTION: Record<
  HomePageTab,
  string
> = {
  [HomePageTabKey.ANALYTICS]: 'Check how much you got from each source.',
  [HomePageTabKey.CALCULATOR]: 'Get your taxes calculated in seconds.',
  [HomePageTabKey.TRANSACTIONS]: 'Keep your income recorded.',
};

export const HOME_PAGE_TABS = [
  HomePageTabKey.TRANSACTIONS,
  HomePageTabKey.ANALYTICS,
  HomePageTabKey.CALCULATOR,
];
