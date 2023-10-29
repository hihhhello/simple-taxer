import { User } from 'next-auth';

import { BurgerMenuIcon } from '@/shared/icons/BurgerMenuIcon';

type NavbarMobileProps = {
  handleSignIn: () => void;
  handleSignOut: () => void;
  pathname: string;
  me: User | undefined | null;
  isAuthenticating: boolean;
};

export const NavbarMobile = () => {
  return (
    <div className="flex items-center justify-between sm:hidden">
      <span className="text-xl text-primary-light-blue">SimpleTax</span>

      <button>
        <BurgerMenuIcon className="text-primary-blue" />
      </button>
    </div>
  );
};
