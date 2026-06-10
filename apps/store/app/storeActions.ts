"use server";

import { getCachedProducts } from "./storeData";

export async function fetchNextPage(
  cursor: string,
  filters: {
    q?: string;
    categoryId?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
  }
) {
  return getCachedProducts(
    filters.q,
    filters.categoryId,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    cursor
  );
}