import { Product } from "database";
import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

export async function updateProduct(
  url: string,
  { arg }: { arg: Partial<Product> }
) {
  return await fetch(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export function useProductMutation(
  productId: number,
  options?: SWRMutationConfiguration<Product, Error, Partial<Product>, any>
) {
  // TODO: Lag en variabel (update) ut av dette og returner et object, for å kunne utvide, og ikke mikse navn
  return useSWRMutation(`/api/products/${productId}`, updateProduct, options);
}
