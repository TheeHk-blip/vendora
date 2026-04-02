"use client";

import { tv } from "tailwind-variants";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDrawer } from "../context/drawerContext";
import { Portal } from "./Portal";
import React from "react";

const sideNav = tv({
  base: "fixed top-0 right-0 z-99 h-dvh flex flex-col bg-background w-[250px] px-1",
  slots: {
    overlay: "fixed inset-0 bg-black/20 dark:bg-white/20 z-40",
    header: "flex flex-row justify-between",
    title: "flex items-center px-3 py-1.5",
    closeButton: "p-2 rounded right-0 hover:bg-gray-100 dark:hover:bg-gray-800",
    children: "flex flex-col w-full overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
    links: "flex flex-col space-y-2",
    link: "bg-white/50 dark:bg-black/70 hover:bg-white/20 hover:dark:bg-black/30 hover:text-blue-600 rounded-xl px-2.5 py-1.5 text-gray-600 dark:text-gray-300 ",
    toggle: "md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
    actions: "flex flex-col p-4 space-y-2 mt-auto",
  },
})

export interface SideNavProps {
  id: string;
  variant?: "default" | "glass";
  title?: React.ReactNode;
  closeButton?: React.ReactNode;
  links?: { label: string; href: string }[];
  body?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function SideNav({
  id,
  variant = "default",
  title,
  closeButton,
  links,
  body,
  actions,
  className
}: SideNavProps) {
  const styles = sideNav({ variant})
  const { openDrawerId, closeDrawer } = useDrawer();

  // check if the current drawer's ID matches the context's open ID
  const isOpen = openDrawerId === id;
  return (
    <AnimatePresence>
      {isOpen && (
      <Portal>
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
            damping: 40,
            restDelta: 2 
          }}
          role="dialog"
          className={styles.base({className:className})}
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
          {body && <div className={styles.children()}>{body}</div>}

          {actions && <div className={styles.actions()} onClick={closeDrawer}>{actions}</div>}
        </motion.div>
      </Portal>
      )}
    </AnimatePresence>
  );
}
