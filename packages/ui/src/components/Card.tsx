"use client";

import { tv, type VariantProps } from "tailwind-variants";
import { ReactNode } from "react";

const card = tv({
  base: "relative -z-10 rounded-xl",
  variants: {
    variant: {
      flat: "p-1.5",
      solid: "bg-white/25 dark:bg-zinc-700/60 backdrop-blur-md px-2 py-1",      
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
    header: "pt-2",
    body: "py-2 text-sm ",
    footer: "text-sm mt-auto h-[40px] py-2",
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
    <div className={styles.base({ class: className})}>
      {/* 🔹 Header */}
      {header && <div className={styles.header()}>{header}</div>}

      {/* 🔹 Body */}
      {children && <div className={styles.body()}>{children}</div>}

      {/* 🔹 Footer */}
      {footer && <div className={styles.footer()}>{footer}</div>}
    </div>
  );
}
