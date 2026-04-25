import { Suspense } from "react";
import ProductFilter, { ProductFilterSkeleton } from "./components/productFilter";
import { BreadCrumbs } from "./components/breadCrumbs";
import { FilterSkeleton, MobileFilter } from "./components/mobileFilter";
import { SerializeData } from "@vendora/ui";
import { ProductGrid } from "./components/productGrid";
import { getStoreData, Params } from "@/app/storeData";
import { ProductGridSkeleton } from "./components/productSkeleton";
import Home from "@mui/icons-material/Home";

async function StoreComponent({searchParams}: { searchParams: Params}) {   
  const dynamicData = await getStoreData({ searchParams });
  return (  
    <div className="flex flex-row justify-between w-full gap-3 items-start">
      <div className="hidden md:flex sticky top-17" >
        <Suspense fallback={<ProductFilterSkeleton />} >
          <ProductFilter dynamicData={dynamicData}/>
        </Suspense>        
      </div>      

      <div className="flex flex-col w-full" >
        <div className="flex flex-col w-full sticky top-12.25 sm:top-12.5 bg-background z-10" >
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
    <div className="flex flex-row max-w-7xl mx-auto h-full w-full gap-3 items-start" >
      <aside className="hidden md:flex h-dvh top-17">
        <ProductFilterSkeleton />
      </aside>
      <div className="flex flex-col w-full">
        <div className="flex flex-col md:hidden top-12.25 sm:top-13">
          <FilterSkeleton />
          <div className="flex items-center text-center space-x-2 text-xs text-gray-600 dark:text-gray-300 overflow-x-auto whitespace-nowrap" >
            <Home />
            Store
          </div>
        </div>
        <div className="hidden md:flex items-center text-center space-x-2 text-xs text-gray-600 dark:text-gray-300 overflow-x-auto whitespace-nowrap" >
          <Home />
          Store
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