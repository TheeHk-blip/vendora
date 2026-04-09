import { Navbar } from "@vendora/ui/src/components/Navbar";
import { ProductSearch } from "./productSearch";
import { Button, SerializeData } from "@vendora/ui";
import { ICategory, LeanArray } from "@vendora/db";
import { CategoryDoc } from "@/app/storeData";

export interface ProductProps {
  dynamicData: {
    parentCategory: ICategory[];
    subCategory: LeanArray<ICategory>;
    leafCategory: LeanArray<ICategory>;
    availableBrands?: {name: string, count: number}[];
    breadCrumbs?: CategoryDoc[];
    maxStorePrice?: number;
    minStorePrice?: number;
  }
}

export function ProductFilterSkeleton() {
  return (
    <div className="hidden md:flex flex-col px-1 gap-2 sticky top-14.5 z-50 w-full h-[calc(100vh-58px)]" >
      <div className="outline-none rounded-xl w-50 bg-black/10 dark:bg-white/25 px-2.5 py-0.5" >Search...</div>
      <p className="uppercase">Filter By:</p>
      <div>
        <section className="mb-2">
          <h3 className="uppercase text-sm text-gray-600 dark:text-gray-300 mb-2 ">
            Selected Category
          </h3>
          <Button variant="outlined">            
          </Button>
        </section>
        <div className="gap-2 flex flex-col" >
          <Button variant="filter" ></Button>
        </div>
      </div>     
      <div className="w-full h-20 bg-foreground/20 rounded-2xl px-2"></div>
    </div>
  )
}

export default function ProductFilter({ dynamicData }: ProductProps) {
  return (
    <Navbar 
      app="storeFilter"
      search={<ProductSearch dynamicData={SerializeData(dynamicData)} />}
    />
  )
}