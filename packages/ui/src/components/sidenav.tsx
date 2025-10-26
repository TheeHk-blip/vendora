"use client";

import { tv } from "tailwind-variants";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDrawer } from "../context/drawerContext";

const sideNav = tv({
  base: "fixed top-0 right-0 z-50 h-screen flex flex-col md:hidden transition-all duration-300 ",
  slots: {
    overlay: "fixed inset-0 bg-black/20 z-40",
    header: "flex flex-row justify-between",
    title: "text-xl font-bold",
    closeButton: "p-2 rounded right-0 hover:bg-gray-100 dark:hover:bg-gray-800",
    links: "flex flex-col p-4 space-y-2",
    link: "bg-white/50 dark:bg-black/70 hover:bg-white/20 hover:dark:bg-black/30 hover:text-blue-600 rounded-lg p-1.5 ",
    toggle: "md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
    actions: "flex flex-col p-4 space-y-2 mt-auto",
  },
  variants: {
    variant: {
      default: "w-64 bg-background shadow-lg",
      glass: "w-64 bg-white/50 dark:bg-black/60 backdrop-blur-xl shadow-lg",
    }
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface SideNavProps {
  variant?: "default" | "glass";
  title?: React.ReactNode;
  closeButton?: React.ReactNode;
  links?: { label: string; href: string }[];
  actions?: React.ReactNode;
}

export function SideNav({
  variant = "default",
  title,
  closeButton,
  links,
  actions,
}: SideNavProps) {
  const styles = sideNav({ variant})
  const { open, closeDrawer } = useDrawer();
  return (
    <AnimatePresence>
      {open && (
      <>
      <motion.div 
        className={styles.overlay()}
        onClick={closeDrawer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3}}
        transition={{ duration: 0.1}}
        exit={{ opacity: 0 }}
        aria-label="Close Menu"
      />
      <motion.div
        initial={{ x: 250, opacity: 0}}
        animate={{ x: 0, opacity: 1}}
        exit={{ x: 250, opacity: 0}}
        transition={{
          type: "spring",
          stiffness: 110,
          damping: 10,
          ease: "easeIn"    
        }}
        role="dialog"
        className={styles.base()}
      >
        <div className={styles.header()}>
          <span className={styles.title()}>{title}</span>
          <div className={styles.closeButton()}>{closeButton}</div>
        </div>

        <div className={styles.links()}>
          {links?.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeDrawer}
              className={styles.link()}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {actions && <div className={styles.actions()}>{actions}</div>}
      </motion.div>
      </>
      )}
    </AnimatePresence>
  );
}
