import { upperFirst } from 'lodash';
import { ChangeEvent, useCallback } from 'react';

import { HOME_PAGE_TABS } from '../../utils/homePageConstants';
import { HomePageTab } from '../../utils/homePageTypes';

type HomePageTabBarMobileProps = {
  currentTab: HomePageTab;
  handleSelectTab: (selectedTab: HomePageTab) => void;
};

export const HomePageTabBarMobile = ({
  currentTab,
  handleSelectTab,
}: HomePageTabBarMobileProps) => {
  const handleChangeCurrentTab = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) =>
      handleSelectTab(event.target.value as HomePageTab),
    [handleSelectTab],
  );

  return (
    <div className="sm:hidden">
      <label htmlFor="tabs" className="sr-only">
        Select a tab
      </label>

      <select
        id="tabs"
        name="tabs"
        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        value={currentTab}
        onChange={handleChangeCurrentTab}
      >
        {HOME_PAGE_TABS.map((tab) => (
          <option value={tab} key={tab}>
            {upperFirst(tab)}
          </option>
        ))}
      </select>
    </div>
  );
};
