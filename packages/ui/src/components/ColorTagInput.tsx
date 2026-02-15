"use client";

import { useState, KeyboardEvent } from "react";

interface ColorTagProps {
  colors: string[];
  onChange: (newColors: string[]) => void;
}

export const ColorInput = ({colors, onChange}: ColorTagProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      const newColor = inputValue.trim().toLowerCase();

      if (newColor && !colors.includes(newColor)) {
        onChange([...colors, newColor]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && colors.length > 0) {
      onChange(colors.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(colors.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white/5 dark:bg-black/20 focus-within:border-blue-500 transition-colors">
      {/* Visual Chips */}
      {colors.map((color, index) => (
        <span 
          key={index}
          className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded-md border border-blue-200"
        >
          {color}
          <button 
            type="button"
            onClick={() => removeTag(index)}
            className="hover:text-red-500 font-bold ml-1"
            aria-label={`Remove ${color}`}
          >
            ×
          </button>
        </span>
      ))}

       {/* Hidden-style Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={colors.length === 0 ? "Enter product colors separated with a comma" : ""}
        className="flex-1 bg-transparent outline-none text-sm py-1"
      />
    </div>
  )
}