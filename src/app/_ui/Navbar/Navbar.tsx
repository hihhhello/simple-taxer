'use client';

import { useCallback } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProviders, signIn } from 'next-auth/react';

import { NavbarDesktop } from './ui/NavbarDesktop';
import { NavbarMobile } from './ui/NavbarMobile';
import { useIsDesktop } from '@/shared/utils/hooks';

type NavbarProps = {
  me: User | undefined | null;
};

export const Navbar = ({ me }: NavbarProps) => {
  const isDesktop = useIsDesktop();

  const handleSignOut = useCallback(() => signOut(), []);

  const { status } = useSession();

  const pathname = usePathname();

  const { data: providers } = useQuery({
    queryKey: ['getProviders'],
    queryFn: getProviders,
  });

  const handleSignIn = useCallback(() => {
    signIn(providers?.google.id);
  }, [providers?.google.id]);

  const isAuthenticating = status === 'loading';

  if (isDesktop) {
    return (
      <NavbarDesktop
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        isAuthenticating={isAuthenticating}
        me={me}
        pathname={pathname}
      />
    );
  }

  return (
    <NavbarMobile
      handleSignIn={handleSignIn}
      handleSignOut={handleSignOut}
      isAuthenticating={isAuthenticating}
      me={me}
      pathname={pathname}
    />
  );
};
