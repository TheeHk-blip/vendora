"use client";

import { Button } from "@vendora/ui/src/components/Button";
import { ProductProps } from "./productFilter";
import Sort from "@mui/icons-material/Sort";
import { SideNav } from "@vendora/ui/src/components/sidenav";
import { useDrawer } from "@vendora/ui/src/context/drawerContext";
import { SearchInput, SerializeData } from "@vendora/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductSearch } from "./productSearch";

export function MobileFilter({ dynamicData }: {dynamicData: ProductProps["dynamicData"]}) {
  const { openDrawer, closeDrawer } = useDrawer();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    router.push(`/store?${params.toString()}`);
  }

  return (
    <div className="flex md:hidden w-full">         
      <div className="flex flex-row justify-between w-full" >
        <SearchInput onSearch={handleSearch} name="mobile search input" />
        <Button
          onClick={() => openDrawer("mobileFilter")}         
          aria-label="toggle filters" 
          className="flex w-fit self-end"
        >
          <Sort />
        </Button>
      </div>
      
      <SideNav 
        id="mobileFilter"
        body={        
          <ProductSearch dynamicData={SerializeData(dynamicData)} />       
        }
        closeButton={            
          <button onClick={closeDrawer} className="self-end" >X</button>        
        }
        className="w-50 px-1"
      />      
    </div>    
  )
}

export function FilterSkeleton() {
  return (
    <div className="flex md:hidden w-full">
      <div className="flex flex-row justify-between w-full">
        {/** search input */}
        <SearchInput name="search input skeleton" />
        
        {/** sort button */}
        <div className="px-2 py-1 rounded-xl flex w-fit bg-black/10 dark:bg-white/10" >
          <Sort/>
        </div>        
      </div>
    </div>
  )
}