"use client";

import { Search } from "@mui/icons-material";
import { useState } from "react";


type SearchInputProps = {
  onSearch: ( query: string) => void;
};

export function SearchInput({ onSearch}: SearchInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value)
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input 
        type="search"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="outline-none"
      />
      <button type="submit">
        <Search className="text-gray-600 dark:text-gray-400"/>
      </button>
    </form>
  )
}