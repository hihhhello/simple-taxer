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

type NavbarDesktopProps = {
  handleSignIn: () => void;
  handleSignOut: () => void;
  pathname: string;
  me: User | undefined | null;
  isAuthenticating: boolean;
};

export const NavbarDesktop = ({
  handleSignIn,
  handleSignOut,
  pathname,
  me,
  isAuthenticating,
}: NavbarDesktopProps) => {
  return (
    <div className="flex items-center justify-between rounded-full bg-white py-4 pl-10 pr-6">
      <div className="flex items-center gap-36">
        <div>
          <span className="text-xl text-primary-light-blue">SimpleTax</span>
        </div>

        <div>
          <Link href="/transactions">
            <span
              className={twMerge(
                'rounded-3xl px-4 py-2 leading-tight text-primary-blue',
                pathname === '/transactions' && 'bg-primary-blue text-white',
              )}
            >
              Transactions
            </span>
          </Link>

          <Link href="/analytics">
            <span
              className={twMerge(
                'rounded-3xl px-4 py-2 leading-tight text-primary-blue',
                pathname === '/analytics' && 'bg-primary-blue text-white',
              )}
            >
              Analytics
            </span>
          </Link>

          <Link href="/calculator">
            <span
              className={twMerge(
                'rounded-3xl px-4 py-2 leading-tight text-primary-blue',
                pathname === '/calculator' && 'bg-primary-blue text-white',
              )}
            >
              Calculator
            </span>
          </Link>
        </div>
      </div>

      {me ? (
        <div className="flex items-center text-primary-blue">
          {me.name && <p>{me.name}</p>}

          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="absolute -inset-1.5" />

                <span className="sr-only">Open user menu</span>

                {me.image && (
                  <Image
                    src={me.image}
                    alt="Profile image"
                    className="h-12 w-12 rounded-full"
                    height={48}
                    width={48}
                  />
                )}
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      className={classNames(
                        active && 'bg-gray-100',
                        'block w-full px-4 py-2 text-left text-sm text-gray-700',
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      ) : !me && isAuthenticating ? (
        <div className="h-10 w-[108px] animate-pulse rounded-3xl bg-slate-200"></div>
      ) : (
        <button
          onClick={handleSignIn}
          className="rounded-3xl bg-primary-blue px-8 py-2  text-white"
        >
          Log In
        </button>
      )}
    </div>
  );
};
