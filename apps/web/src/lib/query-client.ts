import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';
import { cache } from 'react';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {},
};

const getQueryClient = cache(() => new QueryClient(queryClientConfig));

export default getQueryClient;
