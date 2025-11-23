"use client";

import { SearchInput, SortDirection, SortFilter, title } from "@vendora/ui";
import { useRouter } from "next/navigation";

type FilterProps = {
  handleSort: (key: string, direction: SortDirection) => void;
}

export function Header({handleSort}: FilterProps) {
  const router = useRouter();

  const handleSearch = (query: string) => {
    const url = query ? `/user?q=${query}` : `/user`;
    router.push(url);
  }

  return (
    <div className="flex flex-col w-full">
      <span className={title({ color: "foreground", size: "sm", className: "mb-1"})} >Users</span>
      <div className="flex flex-row items-center justify-between" >
        <SearchInput onSearch={handleSearch} />      
        <SortFilter 
          sortKeys={[
            "name",
            "email",
            "role"
          ]}
          onChange={handleSort}
        />  
      </div>
    </div>
  )
}