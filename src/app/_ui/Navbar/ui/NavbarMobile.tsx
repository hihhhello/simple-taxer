import { User } from 'next-auth';

type NavbarMobileProps = {
  handleSignIn: () => void;
  handleSignOut: () => void;
  pathname: string;
  me: User | undefined | null;
  isAuthenticating: boolean;
};

export const NavbarMobile = () => {
  return <></>;
};
