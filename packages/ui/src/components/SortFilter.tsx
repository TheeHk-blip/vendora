"use client";

import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState } from "react";

export type SortDirection = "asc" | "desc";

interface SortFilterProps {
  sortKeys: string[];
  onChange: (key: string, direction: SortDirection) => void;
}

export function SortFilter({ sortKeys, onChange }: SortFilterProps) {
  const [sortKey, setSortkey] = useState(sortKeys[0] || "");
  const [direction, setDirection] = useState<SortDirection>("asc");

  const handleKeyChange = (value: string) => {
    setSortkey(value);
    onChange(value, direction);
  };

  const toggleDirection = () => {
    const newDir: SortDirection = direction === "asc" ? "desc" : "asc";
    setDirection(newDir);
    onChange(sortKey, newDir)
  };

  return(
    <div className="flex items-center gap-2 rounded-[14px] bg-black/15 dark:bg-white/15 px-2 py-1 text-purple-600">
      <select
        value={sortKey}
        onChange={(e) => handleKeyChange(e.target.value)}
        className="focus:outline-none"
      >
        {sortKeys.map((key) => (
          <option key={key} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </option>
        ))}
      </select>

      <button
        onClick={toggleDirection}
      >
        {direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />}
      </button>
    </div>
  )
}