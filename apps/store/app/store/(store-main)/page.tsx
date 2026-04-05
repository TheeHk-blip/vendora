import { Suspense } from "react";
import ProductFilter from "./components/productFilter";
import { BreadCrumbs } from "./components/breadCrumbs";
import { FilterSkeleton, MobileFilter } from "./components/mobileFilter";
import { SerializeData } from "@vendora/ui";
import { ProductGrid } from "./components/productGrid";
import { getStoreData, Params } from "@/app/storeData";
import { ProductGridSkeleton } from "./components/productSkeleton";

async function StoreComponent({searchParams}: { searchParams: Params}) { 
  const dynamicData = await getStoreData({ searchParams });
  return (  
    <div className="flex flex-row max-w-7xl mx-auto w-full gap-2.5">
      <aside className="hidden sm:flex w-min">
        <ProductFilter dynamicData={dynamicData}/>
      </aside>

      <div className="flex flex-col w-full" >
        <div className="sticky top-12.5 bg-background z-10" >
          <Suspense fallback={<FilterSkeleton />} >
            <MobileFilter dynamicData={SerializeData(dynamicData)} />
          </Suspense>
          
          <BreadCrumbs crumbs={dynamicData.breadCrumbs} />
        </div>        
        
        <Suspense fallback={<ProductGridSkeleton key={JSON.stringify(await searchParams)} />}>
          <ProductGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

function StoreSkeleton() {
  return (
    <div className="flex flex-row max-w-7xl mx-auto w-full gap-2.5" >
      <aside className="hidden sm:flex w-min h-dvh">
      </aside>
      <div className="flex flex-col w-full">
        <div className="top-12.5 bg-gray-400">
          <FilterSkeleton />
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  )
}

export default async function Store({ searchParams }: { searchParams: Params }) {
  return (
    <Suspense fallback={<StoreSkeleton />}>
      <StoreComponent searchParams={searchParams} />
    </Suspense>
  )
}