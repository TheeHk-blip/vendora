"use client";

import { tv, type VariantProps } from "tailwind-variants";
import { ReactNode } from "react";

const card = tv({
  variants: {
    variant: {
      flat: "p-1.5",
      solid: {
        wrapper: "bg-white/50 dark:bg-neutral-700/50 px-2 py-1 rounded-lg shadow-sm justify-between flex flex-col",
      },     
      product: {
        wrapper: "relative rounded-md bg-black/20 dark:bg-neutral-700/40",        
        body: "shadow-xs",
        footer: "text-sm h-15 items-center px-1.5 border-b-[1px] border-x-[1px] rounded-b-md border-white dark:border-neutral-700/90",        
      }
    },
    shadow: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
    },
  },
  defaultVariants: {
    variant: "solid",  
    shadow: "sm"
  },
  slots: {
    wrapper: "relative",
    header: "",
    body: " text-sm ",
    footer: "text-sm py-2",
  },
});

export interface CardProps extends VariantProps<typeof card> {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Card({
  variant,
  shadow,
  children,
  header,
  footer,
  className
}: CardProps) {
  const styles = card({ variant, shadow });

  return (
    <div className={styles.wrapper({ class: className})}>
      {/* 🔹 Header */}
      {header && <div className={styles.header()}>{header}</div>}

      {/* 🔹 Body */}
      {children && <div className={styles.body()}>{children}</div>}

      {/* 🔹 Footer */}
      {footer && <div className={styles.footer()}>{footer}</div>}
    </div>
  );
}
