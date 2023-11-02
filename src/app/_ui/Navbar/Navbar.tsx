'use client';

import { Fragment, useCallback } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { getProviders, signIn } from 'next-auth/react';

import { classNames } from '@/shared/utils/helpers';
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

  if (isDesktop) {
    return (
      <NavbarDesktop
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        isAuthenticating={status === 'loading'}
        me={me}
        pathname={pathname}
      />
    );
  }

  return (
    <NavbarMobile
      handleSignIn={handleSignIn}
      handleSignOut={handleSignOut}
      isAuthenticating={status === 'loading'}
      me={me}
      pathname={pathname}
    />
  );
};
