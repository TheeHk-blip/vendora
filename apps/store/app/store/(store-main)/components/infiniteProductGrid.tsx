"use client";

import { fetchNextPage } from "@/app/storeActions";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./productCard";

interface Props {
  initialProducts: any [];
  initialCursor: string | null;
  filters: {
    q?: string;
    categoryId?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
  }
}

export function InfiniteProductGrid({ initialProducts, initialCursor, filters}: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset when filters change
    setProducts(initialProducts);
    setCursor(initialCursor);
  }, [initialProducts, initialCursor]);

  useEffect(() => {
    if (!cursor) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || loading) return;

        setLoading(true);
        const { products: nextProducts, nextCursor } = await fetchNextPage(cursor, filters);
        setProducts(prev => [...prev, ...nextProducts]);
        setCursor(nextCursor);
        setLoading(false);
      },
      { rootMargin: "200px" } 
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [cursor, loading, filters]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-1">
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
      {/* sentinel div — when this enters the viewport, next page loads */}
      <div ref={sentinelRef} className="h-10 w-full" />

      {loading && (
        <div className="flex justify-center py-6 text-gray-400">
          Loading...
        </div>
      )}

      {!cursor && products.length > 0 && (
        <div className="text-center py-6 text-gray-400 text-sm">
          You've seen all products
        </div>
      )}
    </div>
  )
}