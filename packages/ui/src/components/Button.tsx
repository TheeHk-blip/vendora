"use client";

import { tv, type VariantProps } from "tailwind-variants";

export const button = tv({
  base: [
    "inline-flex items-center justify-center font-medium cursor-pointer",
    "transition-all duration-300 select-none",  
    "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:ring-0 disabled:bg-foreground/5 disabled:dark:bg-foreground/5 disabled:text-gray-600 disabled:dark:text-gray-400",
    "hover:ring active:scale-[0.98]"
  ],

  variants: {
    variant: {
      solid: "bg-black/10 dark:bg-white/10",
      flat: "bg-blue-500/25",
      outlined: "ring bg-transparent",
      ghost: "bg-transparent rounded-md backdrop-blur-md p-2 shadow-none",
      buyer: "bg-gradient-to-r from-[#5EA2EF] to-[#0072F5]",
      seller: "bg-gradient-to-r from-[#4ADE80] to-[#16A34A]",
      filter: "w-[200px] bg-foreground/20"
    },
    color: {
      primary:
        "text-white bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-400",
      secondary:
        "text-white bg-purple-500 hover:bg-purple-600 focus-visible:ring-purple-400",
      success:
        "bg-foreground/15 text-green-700 hover:ring",
      danger:
        "bg-red-500 dark:bg-red-500 hover:text-red-500 hover:bg-transparent dark:hover:bg-transparent",
      neutral:
        "bg-foreground/5 text-gray-600 dark:text-gray-400",
      warning:
        "bg-orange-100/50 dark:bg-orange-500/15 text-yellow-600"
    },
    size: {
      sm: "px-2 py-1 text-sm rounded-xl",
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
    {
      variant: "outlined",
      color: "danger",
      class:
        "text-red-500 ring hover:bg-red-500 hover:text-white"
    }
  ],
  defaultVariants: {
    variant: "solid",     
    size: "sm",
    rounded: "md"
  },
});

export type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps extends ButtonVariants {
  children?: React.ReactNode;
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
      {isLoading ? children : children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
