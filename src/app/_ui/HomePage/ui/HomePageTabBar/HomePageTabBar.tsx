import { upperFirst } from 'lodash';

import { HomePageTab } from '../../utils/homePageTypes';
import { HOME_PAGE_TABS } from '../../utils/homePageConstants';
import { HomePageTabBarDesktop } from './HomePageTabBarDesktop';

type HomePageTabsProps = {
  handleSelectTab: (selectedTab: HomePageTab) => void;
  currentTab: HomePageTab;
  className?: string;
};

export const HomePageTabBar = ({
  handleSelectTab,
  currentTab,
  className,
}: HomePageTabsProps) => {
  return (
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
          onChange={(e) => handleSelectTab(e.target.value as HomePageTab)}
        >
          {HOME_PAGE_TABS.map((tab) => (
            <option value={tab} key={tab}>
              {upperFirst(tab)}
            </option>
          ))}
        </select>
      </div>

      <HomePageTabBarDesktop
        currentTab={currentTab}
        handleSelectTab={handleSelectTab}
      />
    </div>
  );
};
