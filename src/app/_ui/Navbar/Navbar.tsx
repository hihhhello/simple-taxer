'use client';

import { useCallback } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { usePathname } from 'next/navigation';

import { NavbarDesktop } from './ui/NavbarDesktop';
import { NavbarMobile } from './ui/NavbarMobile';

type NavbarProps = {
  me: User | undefined | null;
};

export const Navbar = ({ me }: NavbarProps) => {
  const handleSignOut = useCallback(() => signOut(), []);

  const { status } = useSession();

  const pathname = usePathname();

  const isAuthenticating = status === 'loading';

  return (
    <>
      <NavbarDesktop
        handleSignOut={handleSignOut}
        isAuthenticating={isAuthenticating}
        me={me}
        pathname={pathname}
      />

      <NavbarMobile
        handleSignOut={handleSignOut}
        isAuthenticating={isAuthenticating}
        me={me}
        pathname={pathname}
      />
    </>
  );
};
