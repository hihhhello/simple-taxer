import { Fragment } from 'react';
import { User } from 'next-auth';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';

import { classNames } from '@/shared/utils/helpers';
import { SimpleTaxLogoIllustration } from '@/shared/illustartions/SimpleTaxLogoIllustration';
import { LogInButton } from '@/features/LogInButton';
import { NAVIGATION_ITEMS } from '@/shared/utils/navigation';

type NavbarDesktopProps = {
  handleSignOut: () => void;
  pathname: string;
  me: User | undefined | null;
  isAuthenticating: boolean;
};

export const NavbarDesktop = ({
  handleSignOut,
  pathname,
  me,
  isAuthenticating,
}: NavbarDesktopProps) => (
  <div className="hidden items-center justify-between rounded-full bg-white py-4 pl-10 pr-6 sm:flex">
    <div className="flex items-center gap-10">
      <div>
        <SimpleTaxLogoIllustration />
      </div>

      <div>
        {NAVIGATION_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            tabIndex={0}
            className={twMerge(
              'focus-primary-blue rounded-3xl px-4 py-2 leading-tight text-primary-blue',
              pathname === item.href && 'bg-primary-blue text-white',
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>

    {me ? (
      <div className="flex items-center text-primary-blue">
        {me.name && <p>{me.name}</p>}

        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="relative flex rounded-full bg-white text-sm outline focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2">
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
      <LogInButton className="rounded-3xl bg-primary-blue px-8 py-2  text-white" />
    )}
  </div>
);
