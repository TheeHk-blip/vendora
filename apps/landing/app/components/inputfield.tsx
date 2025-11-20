import { ChangeEventHandler, ReactNode } from "react";


export interface InputProps {
  required: boolean;
  name: string;
  type: string;
  value: string | number | readonly string[] | undefined;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  label: string;
  passwordToggle?:  ReactNode;
}

export default function InputField({
  required,
  name,
  type,
  value,
  onChange,
  label,
  placeholder,
  passwordToggle
}: InputProps) {
  return (
    <div className="relative w-full" >
      <input 
        required={required}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="peer px-4 py-2 w-full rounded-2xl bg-black/15 dark:bg-white/10 backdrop-blur-sm 
        placeholder-transparent focus:outline-none focus:bg-black/25 focus:dark:bg-white/25 transition-all"
      />
      <label
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none 
        text-gray-500 dark:text-gray-400 transition-all duration-200 
        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-600"
      >
        {label}
      </label>
      {passwordToggle && 
        <>
          {passwordToggle}
        </>          
      }
    </div>
  )
}