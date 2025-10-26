"use client";

import { ReactNode } from "react";
import { tv } from "tailwind-variants";

const sideBar = tv({
  base: "flex flex-col sticky top-0 left-2 p-4 min-h-screen z-50 transition-all duration-300 ",
  slots: {
    overlay: "fixed inset-0 bg-black/20 z-40",
    header: "flex flex-row justify-between items-center",
    title: "text-xl font-bold",
    brand: "flex items-center",
    closeButton: "p-2 rounded right-0 hover:bg-gray-100 dark:hover:bg-gray-800",
    links: "flex flex-col p-4 space-y-2",
    toggle: "md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
    actions: "flex flex-col p-4 space-y-2 mt-auto",
  },
  variants: {
    variant: {
      default: " w-[250px]",
      glass: "w-[250px] md:w-[260px] bg-white/50 dark:bg-black/60 backdrop-blur-xl shadow-lg",
    }
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface SideBarProps {
  variant?: "default" | "glass";
  children?: ReactNode;
  title?: React.ReactNode;
  brand?: React.ReactNode;
  closeButton?: React.ReactNode; 
  actions?: React.ReactNode;
}

export function SideBar({
  variant = "default",
  children,
  title,
  brand,
  actions,
}: SideBarProps) {
  const styles = sideBar({ variant})

  return (
      <div      
        className={styles.base()}
      >
        <div className={styles.header()}>
          <div className={styles.brand()}>{brand}</div>
          <span className={styles.title()}>{title}</span>          
        </div>       

        {children && <div>{children}</div>}

        {actions && <div className={styles.actions()}>{actions}</div>}        
      </div>
  );
}
