import getQueryClient from '@/lib/query-client';
import type { FetchQueryOptions, QueryFunction, QueryKey } from '@tanstack/react-query';
import { Hydrate, dehydrate } from '@tanstack/react-query';
import React from 'react';

type Props<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = React.PropsWithChildren<{
  queryKey: TQueryKey;
  queryFn: QueryFunction<TQueryFnData, TQueryKey>;
  options?: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
}>;

// Bruk denne for å hindre TS error
// {/* @ts-expect-error Server Component */}

export default async function ReactQueryHydrate({ children, queryKey, queryFn, options }: Props) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(queryKey, queryFn, options);

  const dehydratedState = dehydrate(queryClient);

  // Clear the cache after prefetching, cacheTime is Infinity by default on server, can eat up memory
  queryClient.clear();

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
