"use client";

import { tv, type VariantProps } from "tailwind-variants";

export const button = tv({
  base: [
    "inline-flex items-center justify-center font-medium cursor-pointer",
    "transition-all duration-300 select-none",  
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-[0.98] hover:scale-101 ",
  ],

  variants: {
    variant: {
      solid: "",
      flat: "bg-transparent",
      outlined: "border bg-transparent",
      ghost: "bg-transparent rounded-md backdrop-blur-md p-2 shadow-none",
      buyer: "bg-gradient-to-r from-[#5EA2EF] to-[#0072F5]",
      seller: "bg-gradient-to-r from-[#4ADE80] to-[#16A34A]"
    },
    color: {
      primary:
        "text-white bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-400",
      secondary:
        "text-white bg-purple-500 hover:bg-purple-600 focus-visible:ring-purple-400",
      success:
        "text-white bg-green-600 hover:bg-green-700 focus-visible:ring-green-400",
      danger:
        "text-white bg-red-600 hover:bg-red-700 focus-visible:ring-red-400",
      neutral:
        "text-gray-800 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 hover:dark:bg-gray-800 dark:text-gray-100",
    },
    size: {
      sm: "px-3 py-1.5 text-sm rounded-xl",
      md: "px-4 py-2 w-full text-base rounded-2xl",
      lg: "px-5 py-2.5 text-lg rounded-2xl",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
    loading: {
      true: "opacity-70 cursor-wait pointer-events-none",
    },
  },

  compoundVariants: [    
    {
      variant: "outlined",
      color: "primary",
      class:
        "border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950",
    },
    {
      variant: "outlined",
      color: "secondary",
      class:
        "border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950",
    },
    {
      variant: "flat",
      color: "primary",
      class:
        "bg-zinc-200 text-blue-600 hover:bg-blue-400 hover:text-foreground dark:bg-blue-700 dark:text-blue-200",
    },
    {
      variant: "flat",
      color: "secondary",
      class:
        "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200",
    },
  ],
  defaultVariants: {
    variant: "solid",     
    size: "sm",
  },
});

export type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps extends ButtonVariants {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function Button({
  children,
  variant,
  color,
  size,
  radius,
  isLoading,
  disabled,
  leftIcon,
  rightIcon,
  onClick,
  type,
  className
}: ButtonProps) {
  return (
    <button
      className={button({ variant, color, size, radius, loading: isLoading, class: className })}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {isLoading ? "Loading..." : children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
