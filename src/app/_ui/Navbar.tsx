'use client';

import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import Link from 'next/link';

type TopbarProps = {
  session: Session | null;
};

export const Topbar = ({ session }: TopbarProps) => {
  const handleSignOut = useCallback(() => signOut(), []);

  return (
    <div className="flex items-center justify-between rounded-[100px] bg-white py-4 pl-10 pr-6">
      <div className="flex items-center gap-36">
        <div>
          <span className="text-primary-light-blue text-xl">SimpleTax</span>
        </div>

        <div>
          <Link href="/transactions">
            <span className="text-primary-blue px-4 py-2">Transactions</span>
          </Link>

          <Link href="/analytics">
            <span className="text-primary-blue px-4 py-2">Analytics</span>
          </Link>

          <Link href="/calculator">
            <span className="text-primary-blue px-4 py-2">Calculator</span>
          </Link>
        </div>
      </div>

      <button className="bg-primary-blue rounded-3xl px-8 py-2 text-white">
        Log In
      </button>
    </div>
  );
};
