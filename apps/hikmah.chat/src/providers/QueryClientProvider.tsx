import { JSX, PropsWithChildren } from 'react';
import { getQueryClient } from '../services/query-client';
import { QueryClientProvider } from '@tanstack/react-query';

const ReactQueryClientProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const client = getQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export { ReactQueryClientProvider };
