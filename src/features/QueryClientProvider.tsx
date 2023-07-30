'use client';

import { ReactNode, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from '@tanstack/react-query';

type QueryClientProviderProps = {
  children: ReactNode;
};

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
};
