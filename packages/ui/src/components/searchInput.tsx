"use client";

import Search from "@mui/icons-material/Search";
import { useState } from "react";


type SearchInputProps = {
  onSearch?: ( query: string) => void;
  name: string;
};

export function SearchInput({ onSearch, name }: SearchInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    onSearch?.(value)
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-fit gap-1">
      <input 
        type="search"
        placeholder="Search..."
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="outline-none rounded-md bg-black/20 dark:bg-white/25 w-40 px-2"
      />
      <button type="submit" name="search button" aria-label="search button" >
        <Search className="text-gray-700 dark:text-gray-300 cursor-pointer"/>
      </button>
    </form>
  )
}