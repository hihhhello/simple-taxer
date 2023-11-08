'use client';

import { LogInButton } from '@/features/LogInButton';

export const TransactionsPageLogInCard = () => (
  <div className="rounded-3xl bg-white px-11 py-6 text-center">
    <h1 className="mb-5 text-4xl font-semibold text-primary-blue">
      Master Your Earnings!
    </h1>

    <p className="text-text-regular mb-20">
      Hello there! Navigate your financial waters with ease using our
      &apos;Transactions&apos; tool. Add your income details, and we will do the
      heavy lifting. Stay ahead of tax season and ensure every penny is
      accounted for. Ready to take control? Sign up and start optimizing your
      finances.
    </p>

    <LogInButton className="w-full max-w-sm rounded-full bg-primary-green py-4 text-white" />
  </div>
);
