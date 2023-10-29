import { User } from 'next-auth';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import Link from 'next/link';

import { BurgerMenuIcon } from '@/shared/icons/BurgerMenuIcon';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';

type NavbarMobileProps = {
  handleSignIn: () => void;
  handleSignOut: () => void;
  pathname: string;
  me: User | undefined | null;
  isAuthenticating: boolean;
};

export const NavbarMobile = ({ pathname }: NavbarMobileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between sm:hidden">
      <span className="text-xl text-primary-light-blue">SimpleTax</span>

      <button
        onClick={() => {
          setIsMenuOpen(true);
          document.body.style.overflow = 'hidden';
        }}
      >
        <BurgerMenuIcon className="text-primary-blue" />
      </button>

      <Dialog
        open={isMenuOpen}
        onClose={() => {
          setIsMenuOpen(false);

          document.body.style.overflow = 'unset';
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-white">
          <Dialog.Panel className="flex h-full w-full items-center justify-center">
            <button className="absolute right-4 top-4 h-12 w-12">
              <XMarkIcon />
            </button>

            <div className="flex flex-col items-center justify-center gap-8">
              <Link href="/transactions">
                <span
                  className={twMerge(
                    'rounded-full px-4 py-2 text-4xl leading-tight text-primary-blue',
                    pathname === '/transactions' &&
                      'bg-primary-blue text-white',
                  )}
                >
                  Transactions
                </span>
              </Link>

              <Link href="/analytics">
                <span
                  className={twMerge(
                    'rounded-full px-4 py-2 text-4xl leading-tight text-primary-blue',
                    pathname === '/analytics' && 'bg-primary-blue text-white',
                  )}
                >
                  Analytics
                </span>
              </Link>

              <Link href="/calculator">
                <span
                  className={twMerge(
                    'rounded-full px-4 py-2 text-4xl leading-tight text-primary-blue',
                    pathname === '/calculator' && 'bg-primary-blue text-white',
                  )}
                >
                  Calculator
                </span>
              </Link>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
