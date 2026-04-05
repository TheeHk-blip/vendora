"use client";

import { Button } from "@vendora/ui/src/components/Button";
import ProductFilter, { ProductProps } from "./productFilter";
import Sort from "@mui/icons-material/Sort";
import { SideNav } from "@vendora/ui/src/components/sidenav";
import { useDrawer } from "@vendora/ui/src/context/drawerContext";
import { SearchInput } from "@vendora/ui";
import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="flex md:hidden">         
      <div className="flex flex-row justify-between w-full" >
        <SearchInput onSearch={handleSearch} name="mobile search input" />
        <Button
          onClick={() => openDrawer("mobileFilter")}
          className="flex w-fit self-end"
        >
          <Sort />
        </Button>
      </div>
      
      <SideNav 
        id="mobileFilter"
        body={        
          <ProductFilter dynamicData={dynamicData} />       
        }
        closeButton={            
          <button onClick={closeDrawer} className="self-end" >X</button>        
        }
      />      
    </div>
    
  )
}

export function FilterSkeleton() {
  return (
    <div className="flex md:hidden">
      <div className="flex flex-row justify-between w-full">
        <div className="px-2 py-0.5 w-50" >
          Search...
        </div>
        <Sort />
      </div>
    </div>
  )
}