import { User } from 'next-auth';
import { Dialog } from '@headlessui/react';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { BurgerMenuIcon } from '@/shared/icons/BurgerMenuIcon';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';
import { SignOutIcon } from '@/shared/icons/SignOutIcon';
import { SimpleTaxLogoIllustration } from '@/shared/illustartions/SimpleTaxLogoIllustration';
import { LogInButton } from '@/features/LogInButton';
import { NAVIGATION_ITEMS } from '@/shared/utils/navigation';

type NavbarMobileProps = {
  handleSignOut: () => void;
  pathname: string;
  me: User | undefined | null;
  isAuthenticating: boolean;
};

export const NavbarMobile = ({
  pathname,
  me,
  isAuthenticating,
  handleSignOut,
}: NavbarMobileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);

    document.body.style.overflow = 'unset';
  }, []);

  const handleOpenMenu = useCallback(() => {
    setIsMenuOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <div className="flex items-center justify-between">
      <SimpleTaxLogoIllustration />

      <button onClick={handleOpenMenu}>
        <BurgerMenuIcon className="text-primary-blue" />
      </button>

      <Dialog
        open={isMenuOpen}
        onClose={handleCloseMenu}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-primary-background px-4">
          <Dialog.Panel className="flex h-full w-full items-center justify-center">
            <div className="absolute top-1">
              {me ? (
                <div className="flex items-center text-primary-blue">
                  {me.name && <p>{me.name}</p>}

                  {me.image && (
                    <Image
                      src={me.image}
                      alt="Profile image"
                      className="ml-1 h-12 w-12 rounded-full"
                      height={48}
                      width={48}
                    />
                  )}

                  <button
                    onClick={handleSignOut}
                    className="ml-6 rounded-lg bg-primary-blue p-2"
                  >
                    <SignOutIcon className="text-white" />
                  </button>
                </div>
              ) : !me && isAuthenticating ? (
                <div className="h-10 w-[108px] animate-pulse rounded-3xl bg-slate-200"></div>
              ) : (
                <LogInButton className="rounded-3xl bg-primary-blue px-8 py-2 text-white" />
              )}
            </div>

            <button
              onClick={handleCloseMenu}
              className="absolute right-4 top-4 h-6 w-6"
            >
              <XMarkIcon />
            </button>

            <div className="flex w-60 flex-col items-center justify-center gap-8">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={twMerge(
                    'w-full rounded-full bg-white px-4 py-2 text-center text-primary-blue',
                    pathname === item.href && 'bg-primary-blue text-white',
                  )}
                >
                  <span className="text-xl leading-tight">{item.title}</span>
                </Link>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
