import { Disc, Product } from "database";
import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

async function createDisc(url: string, { arg }: { arg: Partial<Disc> }) {
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export function useDiscMutation(
  options?: SWRMutationConfiguration<Product, Error, Partial<Product>, any>
) {
  // TODO: Lag en variabel (create) ut av dette og returner et object, for å kunne utvide, og ikke mikse navn
  return useSWRMutation(`/api/discs`, createDisc, options);
}
