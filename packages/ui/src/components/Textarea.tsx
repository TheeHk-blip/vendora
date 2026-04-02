"use client"

import { ChangeEventHandler } from "react";

export interface TextProps {
  required?: boolean;
  name: string;  
  value?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;  
  label: string;
  rows: number;
  limit: number;
  minChar: number;
}

export function TextField({
  required,
  name,
  value = "",
  onChange,
  rows,
  limit,
  minChar,
  label
}: TextProps) {  
  const currentLength = value.length;
  const isUnderMin = currentLength < minChar;
  const isAtMax = currentLength >= limit;
  return (
    <div className="relative w-full flex mt-2 gap-2.5 pb-5 rounded-xl bg-black/15 dark:bg-white/10">
      <div className="flex w-full items-center" >
        <textarea 
          required={required}
          name={name}
          value={value}
          maxLength={limit}
          minLength={minChar}
          onChange={onChange}        
          aria-label={label}
          rows={rows}        
          className="[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
          peer px-4 py-2 w-full rounded-2xl  backdrop-blur-sm resize-none
          focus:outline-none transition-all"
        />
        <label
          className="absolute left-4 top-2/8 -translate-y-1/2 pointer-events-none 
          text-gray-600 dark:text-gray-300 transition-all duration-200
          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-neutral-800 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-600"
        >
          {label}
        </label>
      </div>

      <span className={`text-xs mt-2.5 self-end absolute right-1 bottom-1 rounded-md px-1.5
        ${isUnderMin || isAtMax ? "text-red-600 backdrop-blur-md" : "text-gray-700 dark:text-gray-300 backdrop-blur-md"}
      `}
      >
        {isUnderMin ? (
          <> Min: {currentLength} / {minChar} </>
        ):(
          <> Max: {currentLength} / {limit} </>
        )}
      </span>
    </div>
  )
}