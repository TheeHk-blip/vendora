"use client";

import { Button } from "@vendora/ui/src/components/Button";
import { SearchInput } from "@vendora/ui/src/components/searchInput";
import { useRouter, useSearchParams } from "next/navigation";
import { PriceFilter } from "./priceFilter";
import { ProductProps } from "./productFilter";
import { ICategory, RequireIdLean } from "@vendora/db/frontend";
import { Suspense } from "react";
import { CategoryDoc } from "@/app/storeData";

function Search({dynamicData}:{dynamicData: ProductProps["dynamicData"]}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBrands = searchParams.get("brand")?.split(",") || [];
  const currentCatId = searchParams.get("categoryId")

  const categories = dynamicData?.parentCategory || [];
  const subCategories = dynamicData?.subCategory || [];
  const leafCategories = dynamicData?.leafCategory || [];
  const availableBrands = dynamicData?.availableBrands || [];

  const displayCategories = currentCatId
    ? categories.filter((cat: ICategory) => {
      if (cat._id.toString() === currentCatId) return true;

      return dynamicData.breadCrumbs?.some((crumb: CategoryDoc) => crumb._id.toString() === cat._id.toString());
    })
    : categories;

  const handleSearch = (query: string) => {
    const params = new URLSearchParams();

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    router.push(`/store?${params.toString()}`);
  }

  const handleCategoryClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("categoryId", id);
    params.delete("q");
    params.delete("brand");
    router.push(`/store?${params.toString()}`);
  }

  const handleBrandToggle = (brandName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let newBrands = [...selectedBrands];

    if (newBrands.includes(brandName)) {
      newBrands = newBrands.filter(b => b !== brandName);
    } else {
      newBrands.push(brandName);
    }

    if (newBrands.length > 0) {
      params.set("brand", newBrands.join(","));
      params.delete("q");
    } else {
      params.delete("brand")
    }
    router.push(`/store?${params.toString()}`);
  }

  return (
    <div className="flex flex-col w-full justify-center">
      <div className="hidden md:flex mb-2.5 sticky top-0 z-40 bg-background/98">
        <SearchInput onSearch={handleSearch} name="product search" />
      </div>      
      <p className="uppercase" >Filter By:</p>

      <div className="flex flex-col w-full">       
        <section className="mb-2" >
          <h3 className="uppercase text-xs tracking-wider text-gray-600 dark:text-gray-300 mb-2 ">
            {currentCatId ? "Selected Category" : "Main Categories"}
          </h3>
          {currentCatId && (
            <Button
              onClick={() => router.push("/store")}
              className="tracking-widest text-green-500 dark:text-green-500 bg-lime-950 dark:bg-green-300/15 mb-1.5 w-fit" 
              variant="flat"              
            >
              Show All
            </Button>
          )}
          <div className="flex flex-col gap-2">
            {categories.length > 0 ? (
              displayCategories.map((cat: ICategory) => {
                const isActive = currentCatId === cat._id.toString();
                return (
                <Button
                  key={cat._id.toString()}
                  onClick={() => handleCategoryClick(cat._id.toString())}
                  variant="filter"               
                  className={`transition-all uppercase text-xs tracking-widest ${
                    isActive
                    ? "text-green-500 dark:text-green-500 bg-lime-950 dark:bg-green-300/15"
                    : ""
                  } `}
                >
                  {cat.name}
                </Button>
              )})
            ):(
              <p className="text-xs italic text-gray-500" >No further sub-categories</p>
            )}        
          </div>
        </section>
        
        {subCategories.length > 0 && (
          <section className="mb-2">
            <h3 className="font-medium text-xs uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-3">Sub Categories</h3>
            <div className="flex flex-col gap-2">
              {subCategories.map((sub: RequireIdLean<ICategory>) => (
                <Button
                  key={sub._id.toString()}
                  onClick={() => handleCategoryClick(sub._id.toString())}
                  variant="filter"
                  className="transition-all uppercase text-xs tracking-widest"
                >
                  {sub.name}
                </Button>                
              ))}
            </div>
          </section>
        )}

        {leafCategories.length > 0 && (
          <section className="mb-2">
            <h3 className="font-medium text-xs uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-3">Leaf Categories</h3>
            <div className="flex flex-col gap-2">
              {leafCategories.map((leaf: RequireIdLean<ICategory>) => (
                <Button
                  key={leaf._id.toString()}
                  onClick={() => handleCategoryClick(leaf._id.toString())}
                  variant="filter"
                  className="transition-all uppercase text-xs tracking-widest"
                >
                  {leaf.name}
                </Button>
              ))}
            </div>
          </section>
        )}
      </div>

      <PriceFilter maxStorePrice={dynamicData?.maxStorePrice ?? 0} minStorePrice={dynamicData?.minStorePrice ?? 0} />      
      {availableBrands.length > 0 && (
        <div className="spec-filters">
          <h4 className="text-sm uppercase text-gray-600 dark:text-gray-300">Brand</h4>
          {availableBrands.map((brand: { name: string, count: number}) => (
            <label
              key={brand.name}
              className="flex flex-row gap-2 items-center pl-2.5"
            >
              <div className="flex items-center gap-2" >
                <input 
                  type="checkbox"
                  checked={selectedBrands.includes(brand.name)}
                  onChange={() => handleBrandToggle(brand.name)}
                />
                <span>{brand.name}</span>                
              </div>
              <span>{brand.count}</span>
            </label>
          ))}
        </div>
      )}
    </div>    
  )
}

export function ProductSearch({ dynamicData}: {dynamicData: ProductProps["dynamicData"]}) {
  return (
    <Suspense fallback={<span className="animate-pulse" >Loading search filters...</span>}>
      <Search dynamicData={dynamicData} />
    </Suspense>
  )
}