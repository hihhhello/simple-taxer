import { HomePageTab } from '../../utils/homePageTypes';
import { HomePageTabBarDesktop } from './HomePageTabBarDesktop';
import { HomePageTabBarMobile } from './HomePageTabBarMobile';

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
      <HomePageTabBarMobile
        currentTab={currentTab}
        handleSelectTab={handleSelectTab}
      />

      <HomePageTabBarDesktop
        currentTab={currentTab}
        handleSelectTab={handleSelectTab}
      />
    </div>
  );
};
