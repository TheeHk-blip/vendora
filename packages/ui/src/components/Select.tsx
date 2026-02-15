import { ChangeEventHandler } from "react";

export interface SelectProps {
  value?: string | number | readonly string[] | undefined;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  label?: React.ReactNode;
  required?: boolean;
  multiple?: boolean;
  children: React.ReactNode;
}

export function SelectField({
  value,
  label,
  onChange,
  children,
  multiple,
  required
}: SelectProps) {
  return (
    <div className="relative w-full my-1">
      <select
        id="select"
        value={value}
        onChange={onChange}
        required={required}
        multiple={multiple}
        className="peer w-full px-4 py-2 rounded-2xl bg-black/15 dark:bg-white/10 focus:outline-none 
        focus:bg-black/25 focus:dark:bg-white/25 transition-all duration-300 "
      >
        {children}
      </select>
      <label
        htmlFor="select"
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none 
        text-gray-600 dark:text-gray-300 transition-all duration-300 opacity-0 peer-focus:opacity-100
        peer-focus:-top-1 peer-focus:text-xs peer-focus:text-neutral-800 peer-valid:opacity-100 peer-valid:-top-1 peer-valid:text-xs peer-valid:text-blue-600"
      >
        {label}
      </label>
    </div>
  )
}