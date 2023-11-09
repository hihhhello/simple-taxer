'use client';

import { LogInButton } from '@/features/LogInButton';

export const AnalyticsPageLogInCard = () => (
  <div className="rounded-3xl bg-white px-11 py-6 text-center">
    <h1 className="mb-5 text-4xl font-semibold text-primary-blue">
      See Your Finances Come to Life!
    </h1>

    <p className="text-text-regular mb-20">
      Hey, forward-thinker! Transform your financial data into vibrant,
      insightful graphs with our &apos;Analysis&apos; tool. Understand trends,
      seize opportunities, and confidently chart your financial course. Curious
      to see the bigger picture? Sign up and dive into your personalized
      financial overview.
    </p>

    <LogInButton className="w-full max-w-sm rounded-full bg-primary-green py-4 text-white" />
  </div>
);
