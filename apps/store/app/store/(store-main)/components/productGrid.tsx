import { getProducts, Params } from "@/app/storeData";
import ProductCard from "./productCard";


export async function ProductGrid({ searchParams }: { searchParams: Params }) {
  const products = await getProducts({ searchParams });

  if (products.length === 0) {
    return (
      <div className="col-span-full py-10 text-center text-gray-500">
        No product found for that search
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-1">
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          index={index}
        />
      ))}
    </div>
  )
}