"use client";

import Search from "@mui/icons-material/Search";
import { useState } from "react";


type SearchInputProps = {
  onSearch?: ( query: string) => void;
};

export function SearchInput({ onSearch}: SearchInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value)
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-[200px] gap-1">
      <input 
        type="search"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="outline-none rounded-xl w-[200px] bg-black/10 dark:bg-white/25 px-2.5 py-0.5"
      />
      <button type="submit" name="search button">
        <Search className="text-gray-600 dark:text-gray-400 cursor-pointer"/>
      </button>
    </form>
  )
}