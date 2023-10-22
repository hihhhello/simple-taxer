import { upperFirst } from 'lodash';

import { classNames } from '@/shared/utils/helpers';
import { HOME_PAGE_TABS } from '../../utils/homePageConstants';
import { HomePageTab } from '../../utils/homePageTypes';

type HomePageTabBarDesktopProps = {
  currentTab: HomePageTab;
  handleSelectTab: (selectedTab: HomePageTab) => void;
};

export const HomePageTabBarDesktop = ({
  currentTab,
  handleSelectTab,
}: HomePageTabBarDesktopProps) => {
  const makeHandleSelectTab = (tab: HomePageTab) => () => handleSelectTab(tab);

  return (
    <div className="hidden sm:block">
      <nav className="flex space-x-4" aria-label="Tabs">
        {HOME_PAGE_TABS.map((tab) => (
          <span
            key={tab}
            className={classNames(
              tab === currentTab
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700',
              'cursor-pointer rounded-md px-3 py-2 text-sm  font-medium',
            )}
            onClick={makeHandleSelectTab(tab)}
            aria-current={tab === currentTab ? 'page' : undefined}
          >
            {upperFirst(tab)}
          </span>
        ))}
      </nav>
    </div>
  );
};
