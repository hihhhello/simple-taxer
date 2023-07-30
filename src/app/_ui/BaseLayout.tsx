import { ReactNode } from 'react';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="min-h-full">
      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
