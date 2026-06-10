import { getProducts, Params } from "@/app/storeData";
import { InfiniteProductGrid } from "./infiniteProductGrid";

export async function ProductGrid({ searchParams }: { searchParams: Params }) {
  const resolved = await searchParams;
  const { products, nextCursor } = await getProducts({ searchParams });

  if (products.length === 0) {
    return (
      <div className="col-span-full py-10 text-center text-gray-500">
        No product found for that search
      </div>
    )
  }

  return (
    <InfiniteProductGrid 
      initialCursor={nextCursor}
      initialProducts={products}
      filters={{
        q: resolved.q,
        categoryId: resolved.categoryId,
        brand: resolved.brand,
        minPrice: resolved.minPrice,
        maxPrice: resolved.maxPrice
      }}
    />
  )
}