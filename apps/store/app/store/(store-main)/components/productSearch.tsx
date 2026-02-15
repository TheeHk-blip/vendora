"use client";

import { InputField, SelectField } from "@vendora/ui";
import { Button } from "@vendora/ui/src/components/Button";
import { SearchInput } from "@vendora/ui/src/components/searchInput";
import { useRouter, useSearchParams } from "next/navigation";

export function ProductSearch({dynamicData}:{dynamicData: any}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBrands = searchParams.get("brand")?.split(",") || [];

  const categories = dynamicData?.parentCategory || [];
  const subCategories = dynamicData?.subCategory || [];
  const leafCategories = dynamicData?.leafCategory || [];
  const activeCategory = dynamicData?.activeCategory || [];
  const availableBrands = dynamicData?.availableBrands || [];

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());

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
    } else {
      params.delete("brand")
    }
    router.push(`/store?${params.toString()}`);
  }

  return (
    <div className="flex flex-col px-1.5" >
      <div className="mb-2.5">
        <SearchInput onSearch={handleSearch} />
      </div>      

      {/*Dynamic category */}
      <section className="mb-2" >
        <h3 className="uppercase tracking-widest text-gray-600 dark:text-gray-300 mb-2 ">
          Main Categories
        </h3>
        <div className="flex flex-col gap-2">
          {categories.length > 0 ? (
            categories.map((cat:any) => (
              <Button
                key={cat._id}
                onClick={() => handleCategoryClick(cat._id)}
                variant="filter"                
              >
                {cat.name}
              </Button>
            ))
          ):(
            <p className="text-xs italic text-gray-500" >No further sub-categories</p>
          )}        
        </div>
      </section>

      {/*Dynamic Brands */}
      {subCategories.length > 0 && (
        <section className="mb-2">
          <h3 className="font-medium text-xs uppercase tracking-widest text-gray-500 mb-3">Sub Categories</h3>
          <div className="flex flex-col gap-2">
            {subCategories.map((sub: any) => (
              <Button
                key={sub._id}
                onClick={() => handleCategoryClick(sub._id)}
                variant="filter"
              >
                {sub.name}
              </Button>
            ))}
          </div>
        </section>
      )}

      {leafCategories.length > 0 && (
        <section className="mb-2">
          <h3 className="font-medium text-xs uppercase tracking-widest text-gray-500 mb-3">Leaf Categories</h3>
          <div className="flex flex-col gap-2">
            {leafCategories.map((leaf: any) => (
              <Button
                key={leaf._id}
                onClick={() => handleCategoryClick(leaf._id)}
                variant="filter"
              >
                {leaf.name}
              </Button>
            ))}
          </div>
        </section>
      )}
      
      {availableBrands.length > 0 && (
        <div className="spec-filters">
          <h4 className="font-medium text-gray-600 dark:text-gray-300">{activeCategory.name} Filters</h4>
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