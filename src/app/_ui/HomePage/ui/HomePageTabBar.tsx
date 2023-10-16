import { upperFirst } from 'lodash';

import { classNames } from '@/shared/utils';
import { HomePageTabKey } from '../utils/homePageTypes';

const TABS = [
  HomePageTabKey.TRANSACTIONS,
  HomePageTabKey.ANALYTICS,
  HomePageTabKey.CALCULATOR,
];

type HomePageTabsProps = {
  handleSelectTab: (selectedTab: HomePageTabKey) => void;
  currentTab: HomePageTabKey;
  className?: string;
};

export const HomePageTabBar = ({
  handleSelectTab,
  currentTab,
  className,
}: HomePageTabsProps) => (
  <div className={className}>
    <div className="sm:hidden">
      <label htmlFor="tabs" className="sr-only">
        Select a tab
      </label>

      <select
        id="tabs"
        name="tabs"
        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        value={currentTab}
        onChange={(e) => handleSelectTab(e.target.value as HomePageTabKey)}
      >
        {TABS.map((tab) => (
          <option value={tab} key={tab}>
            {upperFirst(tab)}
          </option>
        ))}
      </select>
    </div>

    <div className="hidden sm:block">
      <nav className="flex space-x-4" aria-label="Tabs">
        {TABS.map((tab) => (
          <span
            key={tab}
            className={classNames(
              tab === currentTab
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700',
              'cursor-pointer rounded-md px-3 py-2 text-sm  font-medium',
            )}
            onClick={() => handleSelectTab(tab)}
            aria-current={tab === currentTab ? 'page' : undefined}
          >
            {upperFirst(tab)}
          </span>
        ))}
      </nav>
    </div>
  </div>
);
