import { ReactNode } from 'react';

import { Topbar } from './Topbar';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="min-h-full">
      <Topbar />

      <div className="py-10 px-4 sm:px-0">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
