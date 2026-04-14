"use client";

import { tv, type VariantProps } from "tailwind-variants";
import { ReactNode } from "react";

const card = tv({
  variants: {
    variant: {
      flat: "p-1.5",
      solid: {
        wrapper: "bg-white/45 dark:bg-zinc-700/60 backdrop-blur-md px-2 py-1 rounded-lg",
      },     
      product: {
        wrapper: "relative rounded-lg bg-black/30 dark:bg-white/30",        
        body: "shadow-sm",
        footer: "text-sm h-15 items-center px-1.5",        
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
    footer: "text-sm my-auto py-2",
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
