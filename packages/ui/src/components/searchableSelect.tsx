"use client";

import { useEffect, useRef, useState } from "react";
import { InputField } from "./Input";

export interface SearchableSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function SearchableSelect({
  label,
  options,
  value,
  onChange,
  disabled,
  placeholder
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  return (
    <div className="w-full" ref={wrapperRef}>
      <InputField 
        label={label}
        placeholder={placeholder}
        value={isOpen ? searchTerm : value}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          setSearchTerm(value || "")
        }}
        disabled={disabled}
        autoComplete="off"
      />

      {isOpen && !disabled && (
        <ul className="absolute h-20 bg-foreground text-background rounded-md px-2.5 mt-1.5 overflow-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none">
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt)
                  setSearchTerm("")
                  setIsOpen(false)
                }}
                className="cursor-pointer hover:bg-white/20 dark:hover:bg-black/20 px-2 my-1 rounded-md"
              >
                {opt}
              </li>
            ))
          ):(
            <li>No results found</li>
          )}
        </ul>
      )}
    </div>
  )
}