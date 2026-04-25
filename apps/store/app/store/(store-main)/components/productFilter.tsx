import { Navbar } from "@vendora/ui/src/components/Navbar";
import { ProductSearch } from "./productSearch";
import { Button, SearchInput, SerializeData } from "@vendora/ui";
import { ICategory, LeanArray } from "@vendora/db/frontend";
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
    <div className="hidden md:flex flex-col px-1 sticky top-17 h-[calc(100vh-[80px])] z-30 w-full" >
      <SearchInput name="search filter skeleton" />
      <p className="uppercase">Filter By:</p>
      <div className="flex flex-col mb-2">
        <section className="mb-2">
          <h3 className="uppercase text-sm text-gray-600 dark:text-gray-300 mb-2 ">
            Selected Category
          </h3>
          <Button variant="outlined">     
            Show All       
          </Button>
        </section>
        <div className="gap-2 flex flex-col" >
          <Button variant="filter" >Category</Button>
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