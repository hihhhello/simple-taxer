'use client';

import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

type TopbarProps = {
  session: Session | null;
};

export const Topbar = ({ session }: TopbarProps) => {
  const handleSignOut = useCallback(() => signOut(), []);

  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between rounded-[100px] bg-white py-4 pl-10 pr-6">
      <div className="flex items-center gap-36">
        <div>
          <span className="text-primary-light-blue text-xl">SimpleTax</span>
        </div>

        <div>
          <Link href="/transactions">
            <span
              className={twMerge(
                'text-primary-blue rounded-3xl px-4 py-2',
                pathname === '/transactions' && 'bg-primary-blue text-white',
              )}
            >
              Transactions
            </span>
          </Link>

          <Link href="/analytics">
            <span
              className={twMerge(
                'text-primary-blue rounded-3xl px-4 py-2',
                pathname === '/analytics' && 'bg-primary-blue text-white',
              )}
            >
              Analytics
            </span>
          </Link>

          <Link href="/calculator">
            <span
              className={twMerge(
                'text-primary-blue rounded-3xl px-4 py-2',
                pathname === '/calculator' && 'bg-primary-blue text-white',
              )}
            >
              Calculator
            </span>
          </Link>
        </div>
      </div>

      <button className="bg-primary-blue rounded-3xl px-8 py-2 text-white">
        Log In
      </button>
    </div>
  );
};
