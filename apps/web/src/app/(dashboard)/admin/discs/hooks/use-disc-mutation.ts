import { Product as Disc } from 'database';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

export async function updateDisc(url: string, { arg }: { arg: Partial<Disc> }) {
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export function useDiscMutation(
  discId?: number,
  options?: SWRMutationConfiguration<Disc, Error, Partial<Disc>, any>,
) {
  return useSWRMutation(`/api/discs/${discId}`, updateDisc, options);
}
