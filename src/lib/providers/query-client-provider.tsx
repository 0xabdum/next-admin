'use client';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AxiosError } from 'axios';
import type { ReactNode } from 'react';

import type { BaseError } from '@/types/responses.type';

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        const { response } = error as AxiosError<BaseError>;
        const { status } = response || {};
        console.log(status);
      }
    })
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
};
export default QueryProvider;
