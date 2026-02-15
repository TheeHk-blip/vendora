import { ChangeEventHandler, InputEventHandler, ReactNode } from "react";


export interface InputProps {
  required?: boolean;
  multiple?: boolean;
  name?: string;
  type?: string;
  value?: string | number | readonly string[] | undefined;
  step?: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  placeholder?: string;
  label?: React.ReactNode;
  passwordToggle?:  ReactNode;
}

export function InputField({
  required,
  name,
  type,
  value,
  step,
  onChange,
  label,
  placeholder,
  multiple,
  checked,
  passwordToggle,
}: InputProps) {
  return (
    <div className="relative w-full mt-2" >
      <input 
        required={required}       
        name={name}
        type={type}
        value={value}
        step={step}
        onChange={onChange}
        checked={checked}        
        placeholder={placeholder}
        multiple={multiple}        
        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
        peer px-4 py-2 w-full rounded-2xl bg-black/15 dark:bg-white/10 backdrop-blur-sm placeholder:text-xs
        focus:outline-none focus:bg-black/25 focus:dark:bg-white/25 transition-all"
      />
      <label
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none 
        text-gray-600 dark:text-gray-300 transition-all duration-200 opacity-0 peer-focus:opacity-100
        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-neutral-800 peer-valid:opacity-100 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-600 dark:peer-valid:text-blue-600"
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

