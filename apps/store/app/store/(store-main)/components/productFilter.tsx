import { Navbar } from "@vendora/ui/src/components/Navbar";
import { ProductSearch } from "./productSearch";
import { SerializeData } from "@vendora/ui";
import { ICategory, LeanArray } from "@vendora/db";
import { CategoryDoc } from "./getProducts";

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

export default function ProductFilter({ dynamicData }: ProductProps) {
  return (
    <Navbar 
      app="storeFilter"
      search={<ProductSearch dynamicData={SerializeData(dynamicData)} />}
    />
  )
}