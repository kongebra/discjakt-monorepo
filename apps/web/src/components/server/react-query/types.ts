import type { FetchQueryOptions, QueryKey } from '@tanstack/react-query';

export type QueryHydrateProps<T = unknown> = React.PropsWithChildren<
  {
    options?: FetchQueryOptions<unknown, unknown, unknown, QueryKey>;
    next?: NextFetchRequestConfig;
    cache?: RequestCache;
  } & T
>;
