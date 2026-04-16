import { ChangeEventHandler, HTMLInputAutoCompleteAttribute, ReactNode } from "react";


export interface InputProps {
  id?: string;
  required?: boolean;
  multiple?: boolean;
  name?: string;
  type?: string;
  value?: string | number | readonly string[] | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  step?: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  placeholder?: string;
  label?: React.ReactNode;
  passwordToggle?:  ReactNode;
  className?: string;
  maxLength?: number;
  autoComplete?: HTMLInputAutoCompleteAttribute;
}

export function InputField({
  id,
  required,
  name,
  type,
  value,
  step,
  onChange,
  onFocus,
  autoComplete,
  label,
  placeholder,
  multiple,
  defaultValue,
  checked,
  disabled,
  className,
  maxLength,
  passwordToggle,
}: InputProps) {
  const inputId = id || name;

  return (
    <div className="relative w-full mt-2" >
      <input        
        id={inputId}
        required={required}       
        name={name}
        type={type}
        value={value}
        step={step}
        onChange={onChange}
        checked={checked}        
        disabled={disabled}
        onFocus={onFocus}
        placeholder={placeholder}
        multiple={multiple}       
        defaultValue={defaultValue} 
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`${className} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
        peer w-full px-4 py-2 rounded-2xl bg-black/15 dark:bg-white/10 backdrop-blur-sm placeholder:opacity-0
        focus:outline-none focus:bg-black/25 focus:dark:bg-white/25 transition-all`}
      />
      <label        
        htmlFor={inputId}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none 
        text-gray-600 dark:text-gray-300 transition-all duration-200  peer-focus:opacity-100
        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-neutral-800 peer-valid:opacity-100 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-700 dark:peer-valid:text-blue-500"
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

