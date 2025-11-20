"use client";

import { tv, type VariantProps } from "tailwind-variants";
import {ReactNode} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";

const navbar = tv({
  slots: {
    wrapper: "w-full transition-all duration-300",
    sectionLeft: "flex items-center",
    sectionCenter: "",
    sectionRight: "flex items-center",
    brand: "flex items-center",
    search: "flex items-center justify-between",
    title: "",
    navLinks: "flex gap-2",
    actions: "hidden md:flex gap-2",
    link: "",
    menuToggle: "flex md:hidden",
    avatar: "flex items-center cursor-pointer",
  },

  variants: {
    app: {
      landing: {
        wrapper: "flex flex-row items-center justify-center sticky top-0 z-50 bg-background px-2.5 py-2.5",
        sectionLeft: "flex items-center space-x-2 flex-1",
        sectionCenter: "hidden md:flex justify-center flex-1",
        sectionRight: "flex items-center justify-end space-x-3 flex-1"
      },
      store: {
        wrapper: "flex flex-row items-center justify-center sticky top-0 px-2.5 py-2.5",
        sectionLeft: "flex items-center space-x-2 flex-1",
        sectionCenter: "hidden md:flex justify-center flex-1",
        sectionRight: "flex items-center justify-end space-x-3 flex-1"
      },
      admin: {
        wrapper: "flex flex-col sticky top-0 px-4 pb-2 min-h-screen w-[240px]",
        sectionLeft: "flex mb-2.5",
        brand: "flex w-full justify-between",
        sectionCenter: "flex-1",
        sectionRight: "flex items-center my-auto",
        navLinks: "flex flex-col space-y-2 w-full",
        actions: "flex flex-col w-full"
      },
      adminnav: {
        wrapper: "flex flex-row items-center px-2.5 py-1.5 sticky top-0.5 max-w-[98%] mx-auto mb-3.5 z-50 bg-white/40 backdrop-blur-sm rounded-xl",
        sectionLeft: "flex items-center space-x-2 flex-1",
        sectionCenter: "hidden md:flex justify-center flex-1",
        sectionRight: "flex items-center justify-end space-x-3 flex-1"
      },
    },
    sticky: {
      true: "sticky top-0 z-50"
    },
  },

  defaultVariants: {
    app: "landing",
    sticky: true,
  }
});

const navLink = tv({
  base: "flex px-3 py-2 gap-2 font-medium transition-all duration-300 rounded-[14px]",
  variants: {
    app: {
      landing: "ring-0 hover:ring hover:text-blue-600",
      store: "ring-0 hover:ring hover:text-green-600",
      admin: "bg-white/25 hover:text-purple-600 hover:bg-purple-200/50 dark:bg-black/40 dark:hover:bg-black/20",
      adminnav: "ring-0 hover:ring hover:text-blue-600",
    },
    active: {
      true: "",
    }
  },
  compoundVariants: [
    {
      app: "landing",
      active: true,  
      className: "text-white bg-blue-600 hover:text-white hover:ring-0"
    },
    {
      app: "store",
      active: true,
      className: "text-white bg-green-600 hover:text-white hover:ring-0"
    },
    {
      app: "admin",
      active: true,
      className: "text-purple-600 bg-purple-400/20 dark:bg-purple-400/30 scale-105 -translate-y-1 -translate-x-1"
    }
  ],
  defaultVariants: {
    active: false
  }
});

export interface NavbarProps extends VariantProps<typeof navbar> {
  theme?: "light" | "dark";
  app?: "landing" | "store" | "admin" | "adminnav";
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  menuToggle?: ReactNode;
  links?: { label: string; href: string; icon?:any }[];
  brand?: ReactNode;
  search?: ReactNode;
  avatar?: ReactNode;
  sidenav?: ReactNode;
}

export function Navbar({  
  title,
  app,
  sticky,
  actions,
  links,
  brand,
  search,
  avatar,
  menuToggle,
  sidenav,
}: NavbarProps)

{
  const styles = navbar({ app, sticky });
  const pathname = usePathname();

  return (
    <nav className={styles.wrapper()}>     
      <div className={styles.sectionLeft()}>
        <div className={styles.brand()}>
          {brand}          
          <span className={styles.title()}>{title}</span>   
          <div className={styles.search()}>{search}</div>     
        </div>
      </div>

      <div className={styles.sectionCenter()}>
        {links &&
          <div className={styles.navLinks()}>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return(
                <Link
                  key={link.label}
                  href={link.href}
                  className={navLink({ app, active: pathname === link.href})}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.icon && <link.icon />} 
                  {link.label}
                </Link>
              )
            })}
          </div>
        }
      </div>

      <div className={styles.sectionRight()}>    
        {menuToggle && <div className={styles.menuToggle()}>{menuToggle}</div>}    
        {actions && <div className={styles.actions()}>{actions}</div>}
        {avatar && <div className={styles.avatar()}>{avatar}</div>}
      </div>
      {sidenav}
    </nav>
  );
}