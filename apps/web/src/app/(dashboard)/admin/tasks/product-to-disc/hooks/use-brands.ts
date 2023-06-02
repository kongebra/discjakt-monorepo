import { Brand } from "database";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useBrands() {
  return useSWR<(Brand & { _count: { discs: number; plastics: number } })[]>(
    "/api/brands",
    fetcher
  );
}
