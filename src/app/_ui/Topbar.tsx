'use client';

import { Fragment, useCallback } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';

import { classNames } from '@/shared/utils';
import Image from 'next/image';

export const Topbar = () => {
  const handleSignOut = useCallback(() => signOut(), []);

  const session = useSession();

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {() => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-end">
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />

                      <span className="sr-only">Open user menu</span>

                      {session.data?.user?.image ? (
                        <Image
                          src={session.data?.user?.image}
                          alt="Profile image"
                          className="h-8 w-8 rounded-full"
                          height={32}
                          width={32}
                        />
                      ) : (
                        <div className="h-8 w-8 bg-slate-200 animate-pulse rounded-full"></div>
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
                      {session.data?.user?.name && (
                        <Menu.Item>
                          <p className="font-semibold text-sm px-4 py-2 text-center border-b-2">
                            {session.data?.user?.name}
                          </p>
                        </Menu.Item>
                      )}

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={classNames(
                              active && 'bg-gray-100',
                              'block px-4 py-2 text-sm text-left w-full text-gray-700',
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
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};