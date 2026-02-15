import { Navbar } from "@vendora/ui/src/components/Navbar";
import { ProductSearch } from "./productSearch";
import { SerializeData } from "@vendora/ui";

interface ProductProps {
  dynamicData: {
    parentCategory: any[];
    subCategory: any[];
    leafCategory: any[];
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