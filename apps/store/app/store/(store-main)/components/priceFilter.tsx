"use client";

import { InputField } from "@vendora/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

interface PriceProps {
  maxStorePrice: number;
  minStorePrice: number
}

function Filter({ maxStorePrice, minStorePrice } : PriceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [range, setRange] = useState({
    min: Number(searchParams.get("minPrice")) || minStorePrice,
    max: Number(searchParams.get("maxPrice")) || maxStorePrice
  });

  const handlePriceChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", range.min.toString());
    params.set("maxPrice", range.max.toString());
    router.push(`/store?${params.toString()}`);
  };

  return (
     <div className="flex flex-col gap-2 my-1">
      <h3 className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">Price Range</h3>
      <div className="flex flex-row items-center justify-center gap-2">
        <InputField
          type="number" 
          label="MIN"
          placeholder="Min"
          value={range.min}
          onChange={(e) => setRange({ ...range, min: Number(e.target.value) })}          
        />
        <InputField
          type="number" 
          label="MAX"
          placeholder="Max"
          value={range.max}
          onChange={(e) => setRange({ ...range, max: Number(e.target.value) })}         
        />
      </div>
      <button 
        onClick={handlePriceChange}
        aria-label="price filter button"
        className="text-xs tracking-widest py-1.5 rounded-md cursor-pointer text-green-500 dark:text-green-500 bg-lime-950 dark:bg-green-300/15 hover:ring"
      >
        Apply Price
      </button>
    </div>
  )
}

export function PriceFilter({maxStorePrice, minStorePrice}: PriceProps) {
  return (
    <Suspense fallback={<span className="animate-pulse w-40 h-20 bg-foreground/25 rounded-md" >Loading price filter...</span>} >
      <Filter maxStorePrice={maxStorePrice} minStorePrice={minStorePrice} />
    </Suspense>
  )
}